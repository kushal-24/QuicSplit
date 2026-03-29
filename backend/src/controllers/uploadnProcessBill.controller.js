import { File } from "../models/file.model.js";
import Expense from "../models/expense.model.js";
import {Group} from "../models/group.model.js";
import Settlement from "../models/settlement.model.js";
import asyncHandler from "../utils/asyncHandler.js"
import apiResponse from "../utils/apiResponse.js"
import apiError from "../utils/apiError.js"
import { getGroupBalances } from "./getBalances.controller.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const uploadAndProcessBill = asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const userId = req.user._id;

    //checking if grp exists
    const group = await Group.findById(groupId);
    if (!group) {
        throw new apiError(404, "Group not found");
    }

    //if member valid
    const isMember = group.members.some(
        member => member.toString() === userId.toString()
    );

    if (!isMember) {
        throw new apiError(403, "You are not a member of this group");
    }

    const filePath = req.file.path;

    //Upload to Cloudinary
    const uploadedFile = await uploadOnCloudinary(filePath);

    if (!uploadedFile) {
        throw new apiError(500, "File upload failed");
    }

    //LLM comes into the playy
    let extractedData;
    extractedData=RETURN;

    //create file MODEL ka ek FILE
    const uploadedBill = await File.create({
        url: uploadedFile.secure_url,
        public_id: uploadedFile.public_id,
        uploadedBy: userId,
        group: groupId,
        ocrText: text,
        extractedAmount: amount,//🚨🚨🚨🚨🚨🚨
        extractedTitle: description //🚨🚨🚨🚨🚨
    });

    //Split among members
    const members = group.members; //gives a list of the memberIds
    const share = amount / members.length;//🚨🚨//🚨🚨//🚨🚨//🚨🚨

    const participants = members.map(memberId => ({
        user: memberId,
        share: share
    }));

    //Create Expense MODEL ka ek EXPENSE
    const expense = await Expense.create({
        group: groupId,
        paidBy: userId,
        amount: amount, //🚨🚨//🚨🚨//🚨🚨
        description: description, //🚨🚨//🚨🚨
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

const createExpense= asyncHandler(async(req,res)=>{
    const {groupId}= req.params;
    const{amt, ppl, paidBy, name, description}=req.body;

    if(!amt) throw new apiError(403, "Incomplete input");
    if(!name) throw new apiError(403, "Incomplete input, pls provide your expense's Name as well");

    const len=ppl.length;
    const share=amt/len;

    const participants=[];
    for(const p of ppl){
        participants.push({user: p, share: share}); //🚨🚨🚨🚨
    }

    const newExpense= await Expense.create({
        paidBy: paidBy,
        expenseName: name,
        amount: amt,
        group: groupId,
        description: description||"",
        participants: participants
    })

    if(!newExpense) throw new apiError(404, "Server request failed to create newExpense");

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
    const {groupId} = req.params;
    const {expId} = req.params;
  
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
    const{groupId}= req.parms
    const { from, to, amount, note } = req.body;
  
    const group = await Group.findById(groupId);
    if (!group) throw new apiError(404, "Group not found");
  
    await Settlement.create({ 
        group: groupId, 
        from, 
        to, 
        amount, 
        note 
    });
  
    const result = await calculateGroupBalances(groupId);
  
    return res.status(201).json(new apiResponse({
      balances: result.balances,
      transactions: result.transactions
    }, 201, "Settlement created"));
});


export {
    uploadAndProcessBill,
    createExpense,
    deleteExpense,
    createSettlement
}