import File from "../models/file.model.js";
import { Expense } from "../models/expense.model.js";
import { Group } from "../models/group.model.js";
import { Settlement } from "../models/settlement.model.js";
import fuzzy from "fuzzysort"
import asyncHandler from "../utils/asyncHandler.js"
import apiResponse from "../utils/apiResponse.js"
import apiError from "../utils/apiError.js"
import { getGroupBalances } from "./getBalances.controller.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { llm } from "../ai/llm.js";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { User } from "../models/user.model.js";
import graph from "../ai/graphs.js";

const uploadAndProcessBill = asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const userId = req.user._id;

    //checking if grp exists
    const group = await Group.findById(groupId);
    if (!group) {
        throw new apiError(404, "Group not found");
    }
    const groupUsers = await User.find({ _id: { $in: group.members } }).select("fullName");

    //if member valid
    const isMember = group.members.some(
        member => member.toString() === userId.toString()
    );

    if (!isMember) {
        throw new apiError(403, "You are not a member of this group");
    }

    const filePath = req.file?.path;

    //Upload to Cloudinary
    const uploadedFile = await uploadOnCloudinary(filePath);

    if (!uploadedFile) {
        throw new apiError(500, "File upload failed");
    }

    //LLM comes into the playy
    const imageResponse = await fetch(uploadedFile.secure_url);
    const arrayBuffer = await imageResponse.arrayBuffer(); //reads the response body as raw bytes and helps conversion to base64
    const base64Image = Buffer.from(arrayBuffer).toString("base64"); //converts the raw bytes to base64 string
    const mimeType = req.file.mimetype; // e.g. "image/jpeg"


    const { prompt } = req.body;

    let extractedData;
    try {
        const result = await llm.invoke([
            new HumanMessage({
                content: [
                    {
                        type: "image_url",
                        image_url: { url: `data:${mimeType};base64,${base64Image}` }
                    },
                    {
                        type: "text",
                        text: `You are a receipt scanner. Extract details from this receipt image.
                        When a bill is uploaded, scan it for who paid or search in the text prompt who paid. 
                        If you still dont get who paid, ONLY THEN assume that the user uploading the bill has paid it.
                        ${prompt ?
                                `USER INSTRUCTION: 
                        ${prompt}` : ""}
                    Return ONLY a valid JSON object, no markdown, no explanation:
                    { 
                        "expenseName": "merchant or bill name",
                        "amount": 999.00,
                        "description": "short description of what was purchased",
                        "ocrText": "full raw text you can read from the receipt",
                        "paidBy": "full name  of the person who paid the whole bill, if not specified, consider the user paid the whole bill who uploaded the bill"
                    }`
                    }
                ]
            })
        ]);
        const raw = result.content;
        const clean = raw.replace(/```json|```/g, "").trim();
        extractedData = JSON.parse(clean);
    } catch (err) {
        throw new apiError(500, "AI processing or JSON parsing failed: " + err.message);
    }

    /** THIS IS WHAT FUZZY RETURNS US ON FUZZYSORT SEARCH
     [
       {
         string: "Kushal",     // matched string
         score: 0.02,         // how close the match is (lower = better)
         obj: {               // 🔥 YOUR ORIGINAL OBJECT
           _id: "abc123",
           fullName: "Kushal"
         }
       },
       {
         string: "Kunal",
         score: 0.3,
         obj: { _id: "xyz456", fullName: "Kunal" }
       }
     ]
     */

    const { expenseName, amount, description, ocrText, paidBy } = extractedData;

    //Fuzzy match
    const match = fuzzy.go(paidBy, groupUsers, { key: "fullName" })[0];
    //Final user ID
    const paidByUserId = match?.obj?._id || userId;

    const finalAmount = parseFloat(amount);


    //create file MODEL ka ek FILE
    const uploadedBill = await File.create({
        url: uploadedFile.secure_url,
        public_id: uploadedFile.public_id,
        uploadedBy: userId,
        group: groupId,
        ocrText: ocrText,
        extractedAmount: finalAmount,
        extractedTitle: expenseName,
        paidBy: paidByUserId,
    });

    //Split among members
    const members = group.members; //gives a list of the memberIds
    const share = amount / members.length;

    const participants = members.map(memberId => ({
        user: memberId,
        share: share
    }));

    //Create Expense MODEL ka ek EXPENSE
    const expense = await Expense.create({
        expenseName: expenseName,
        group: groupId,
        paidBy: paidByUserId,
        amount: amount,
        description: description,
        file: uploadedBill._id,
        participants: participants
    });

    return res.status(201).json(
        new apiResponse(
            {
                file: uploadedBill,
                Expense: expense
            },
            201,
            "Bill uploaded and processed successfully"
        )
    );
});

const chatWithAI = asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const { messages } = req.body;  // full history from frontend
    const userId = req.user._id;

    // get group members for system prompt
    const group = await Group.findById(groupId).populate("members", "fullName");
    if (!group) throw new apiError(404, "Group not found");

    const memberNames = group.members.map(m => m.fullName);

    // format history for Gemini
    const formattedMessages = messages.map(msg =>
        msg.role === "user"
            ? new HumanMessage(msg.content)
            : new AIMessage(msg.content)
    );

    // Use the LangGraph instead of direct LLM call
    const result = await graph.invoke(
        {
            messages: formattedMessages,
        },
        {
            configurable: {
                thread_id: req.body.threadId || groupId, // Maintain memory via threadId
                groupId: groupId,
                memberNames: memberNames
            }
        }
    );

    // Extract the final message content from the graph state
    const reply = result.messages.at(-1).content;

    res.status(200).json(new apiResponse(
        { reply },
        200,
        "AI response"
    ));
});


const createExpense = asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const { amt, ppl, paidBy, name, description } = req.body;

    if (!amt) throw new apiError(403, "Incomplete input");
    if (!name) throw new apiError(403, "Incomplete input, pls provide your expense's Name as well");

    const len = ppl.length;
    const share = amt / len;

    const participants = [];
    for (const p of ppl) {
        participants.push({ user: p, share: share }); //🚨🚨🚨🚨
    }

    const newExpense = await Expense.create({
        paidBy: paidBy,
        expenseName: name,
        amount: amt,
        group: groupId,
        description: description || "",
        participants: participants
    })

    if (!newExpense) throw new apiError(404, "Server request failed to create newExpense");

    const result = await getGroupBalances(groupId);

    return res
        .status(200)
        .json(
            new apiResponse({
                message: "Expense created",
                balances: result.balances,
                transactions: result.transactions
            }, 200, "success"));
})

const deleteExpense = asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const { expId } = req.params;

    await Expense.findByIdAndDelete(expId);
    const result = await getGroupBalancesInternal(groupId);

    return res.status(200).json(
        new apiResponse(
            {
                message: `Expense "${tobedeleted.expenseName}" deleted`,
                balances: result.balances,
                transactions: result.transactions
            },
            200,
            "Expense deleted successfully"
        )
    );
});

const createSettlement = asyncHandler(async (req, res) => {
    const { groupId } = req.params
    const { from, to, amount, note } = req.body;
    const userId = req.user?._id

    const group = await Group.findById(groupId);
    if (!group) throw new apiError(404, "Group not found");

    await Settlement.create({
        group: groupId,
        from,
        to,
        amount,
        note
    });

    const result = await getGroupBalances(groupId, userId);

    return res.status(201).json(new apiResponse({
        balances: result.balances,
        transactions: result.transactions
    }, 201, "Settlement created"));
});

const getExpenses = asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const expenses = await Expense.find({ group: groupId }).populate("paidBy", "fullName");
    if (!expenses) {
        throw new apiError(404, "No expenses found");
    }
    return res.status(200).json(new apiResponse(expenses, 200, "success"));
})


export {
    uploadAndProcessBill,
    createExpense,
    deleteExpense,
    createSettlement,
    getExpenses,
    chatWithAI
}