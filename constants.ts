export const DEFAULT_SYSTEM_PARAMS = {
  alpha: 0.7,          // Moderate creativity
  beta: 8000,          // Moderate thinking budget
  gamma: 0.8,          // High retention
  recursionLimit: 3    // Max sub-goal depth
};

export const MAX_THINKING_BUDGET = 24576; // Gemini 2.5 Flash limit
export const MIN_THINKING_BUDGET = 1024;