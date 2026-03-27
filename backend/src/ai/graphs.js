import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { llm } from "./llm.js";
import { getExpenses, modifyExpenseSplit } from "./tools.js";

const tools = [getExpenses, modifyExpenseSplit];
const llmWithTools = llm.bindTools(tools);

// Node 1 — call the LLM
async function callLLM(state) {
  const response = await llmWithTools.invoke(state.messages);
  return { messages: [response] };
}

// Node 2 — execute whatever tool LLM decided to call
async function runTool(state) {
  const lastMessage = state.messages.at(-1);
  const results = [];
  for (const toolCall of lastMessage.tool_calls) {
    if (toolCall.name === "getExpenses") {
      results.push(await getExpenses.invoke(toolCall.args));
    }
    if (toolCall.name === "modifyExpenseSplit") {
      results.push(await modifyExpenseSplit.invoke(toolCall.args));
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

const graph = new StateGraph(MessagesAnnotation)
  .addNode("callLLM", callLLM)
  .addNode("runTool", runTool)
  .addEdge("__start__", "callLLM")
  .addConditionalEdges("callLLM", shouldContinue)
  .addEdge("runTool", "callLLM")
  .compile();

export default graph;