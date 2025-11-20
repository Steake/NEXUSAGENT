import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AgentGoal, SystemParameters } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Define schemas for structured outputs
const subGoalSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    hasKnowledgeGaps: { type: Type.BOOLEAN, description: "True if the agent lacks information to solve this immediately." },
    reasoning: { type: Type.STRING, description: "The chain of thought leading to this decision." },
    analysisConfidence: { type: Type.INTEGER, description: "Confidence score (0-100) in this analysis and current state of knowledge." },
    subGoals: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING, description: "A specific, actionable sub-goal to fill the gap." },
          predictedConfidence: { type: Type.INTEGER, description: "Predicted probability (0-100) of successfully completing this sub-goal." },
          priority: { type: Type.INTEGER, description: "Priority level (1-10). 10 is critical/blocking, 1 is optional." }
        },
        required: ["description", "predictedConfidence", "priority"]
      },
      description: "List of sub-goals if gaps exist."
    },
    directSolution: { type: Type.STRING, description: "The solution if no gaps exist." }
  },
  required: ["hasKnowledgeGaps", "reasoning", "analysisConfidence"]
};

export const analyzeGoal = async (
  goal: AgentGoal, 
  context: string, 
  params: SystemParameters
): Promise<any> => {
  
  // We use gemini-2.5-flash for the reasoning loop as it supports thinkingConfig
  const modelId = 'gemini-2.5-flash';

  // Construct the prompt
  const prompt = `
    You are an autonomous, goal-seeking agent. 
    Current Goal: "${goal.description}"
    Context/Knowledge So Far: ${context}
    
    Analyze this goal. Determine if you have sufficient knowledge in the context or within your general training to solve it definitively RIGHT NOW.
    
    1. Assign an 'analysisConfidence' score (0-100) reflecting your certainty about the current situation.
    2. If you identify "Knowledge Gaps" (missing specific data, ambiguity, or complex steps requiring breakdown), set 'hasKnowledgeGaps' to true.
    3. If gaps exist, break them down into 'subGoals'. 
       - For each sub-goal, estimate a 'predictedConfidence' (0-100).
       - Assign a 'priority' (1-10) based on urgency. Dependencies/Blockers must be higher priority.
    4. If you can solve it now, set 'hasKnowledgeGaps' to false and provide the 'directSolution'.
    
    Use purely logical reasoning. Do not hallucinate data.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        temperature: params.alpha, // Controlled by the Erbingham Alpha parameter
        responseMimeType: "application/json",
        responseSchema: subGoalSchema,
        thinkingConfig: {
          thinkingBudget: params.beta // Controlled by Erbingham Beta parameter
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from model");
    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};

export const synthesisStep = async (
  goals: AgentGoal[],
  params: SystemParameters
): Promise<string> => {
  // Used to summarize completed goals into the knowledge graph
  const modelId = 'gemini-2.5-flash';
  
  const completedGoals = goals.filter(g => g.status === 'COMPLETED');
  if (completedGoals.length === 0) return "";

  const content = completedGoals.map(g => `Goal: ${g.description}\nResult: ${g.outcome}`).join('\n---\n');

  const prompt = `Synthesize the following completed agent actions into a concise knowledge summary. Capture key facts learned. \n\n${content}`;

  const response = await ai.models.generateContent({
    model: modelId,
    contents: prompt,
    config: {
      temperature: 0.2, // Low temp for factual synthesis
    }
  });

  return response.text || "";
};