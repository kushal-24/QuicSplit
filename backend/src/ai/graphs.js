import { StateGraph, MessagesAnnotation, MemorySaver } from "@langchain/langgraph";
import { SystemMessage } from "@langchain/core/messages";
import { llm } from "./llm.js";
import {
  getExpensesTool, 
  createExpenseTool, 
  calculateGroupBalancesTool, 
  reduceXinYTool,
  deleteExpenseTool
} from "./tools.js";
import { getSystemPrompt } from "./prompt.js";

const tools = [getExpensesTool, createExpenseTool, calculateGroupBalancesTool, reduceXinYTool, deleteExpenseTool];
const llmWithTools = llm.bindTools(tools);

// Node 1 — call the LLM
async function callLLM(state, config) {
  const messages = state.messages;
  const { groupId, memberNames } = config.configurable;

  const hasSystem = messages[0]?._getType?.() === "system";

  const finalMessages = hasSystem
    ? messages
    : [
        new SystemMessage(getSystemPrompt( groupId, memberNames)),
        ...messages
      ];

  const response = await llmWithTools.invoke(finalMessages);
  return { messages: [response] };
}

// Node 2 — execute whatever tool LLM decided to call
async function runTool(state) {
  const lastMessage = state.messages.at(-1);
  const results = [];
  for (const toolCall of lastMessage.tool_calls) {
    if (toolCall.name === "getExpenses") {
      results.push(await getExpensesTool.invoke(toolCall.args));
    }
    if (toolCall.name === "createExpense") {
      results.push(await createExpenseTool.invoke(toolCall.args));
    }
    if (toolCall.name === "getAccountBalancesNSettle") {
      results.push(await calculateGroupBalancesTool.invoke(toolCall.args));
    }
    if (toolCall.name === "transaction_n_settlement") {
      results.push(await reduceXinYTool.invoke(toolCall.args));
    }
    if (toolCall.name === "deleteExpense") {
      results.push(await deleteExpenseTool.invoke(toolCall.args));
    }
  }
  return { messages: results };
}

// Routing — did LLM call a tool or just reply?
function shouldContinue(state) {
  const lastMessage = state.messages.at(-1);
  if (lastMessage.tool_calls?.length > 0) return "runTool";
  return "__end__";
}

const checkpointer = new MemorySaver();

const graph = new StateGraph(MessagesAnnotation)
  .addNode("callLLM", callLLM)
  .addNode("runTool", runTool)
  .addEdge("__start__", "callLLM")
  .addConditionalEdges("callLLM", shouldContinue)
  .addEdge("runTool", "callLLM")
  .compile({ checkpointer });

export default graph;