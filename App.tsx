import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { GoalGraph } from './components/GoalGraph';
import { TerminalLog } from './components/TerminalLog';
import { AgentGoal, AgentLog, GoalStatus, SystemParameters } from './types';
import { DEFAULT_SYSTEM_PARAMS } from './constants';
import { analyzeGoal, synthesisStep } from './services/geminiService';
import { v4 as uuidv4 } from 'uuid';

export default function App() {
  // -- State --
  const [params, setParams] = useState<SystemParameters>(DEFAULT_SYSTEM_PARAMS);
  const [goals, setGoals] = useState<AgentGoal[]>([]);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [knowledgeContext, setKnowledgeContext] = useState<string>("System Initialized. No external data.");
  const [inputValue, setInputValue] = useState("");

  // -- Refs for Async Loop Management --
  const isProcessingRef = useRef(false);

  // -- Helpers --
  const addLog = (type: AgentLog['type'], message: string, details?: string) => {
    setLogs(prev => [...prev, {
      id: uuidv4(),
      timestamp: Date.now(),
      type,
      message,
      details
    }]);
  };

  // -- Core Agent Loop --
  const runAgentCycle = useCallback(async () => {
    if (!isRunning || isProcessingRef.current) return;

    // 1. Find highest priority pending goal
    const pendingGoals = goals.filter(g => g.status === GoalStatus.PENDING);
    if (pendingGoals.length === 0) {
      if (goals.length > 0 && goals.every(g => g.status === GoalStatus.COMPLETED)) {
        addLog('INFO', 'All directives completed. Standing by.');
        setIsRunning(false);
      }
      return;
    }

    // Select Goal: Highest Priority first, then LIFO (Deepest/Newest)
    const maxPriority = Math.max(...pendingGoals.map(g => g.priority ?? 5));
    const candidates = pendingGoals.filter(g => (g.priority ?? 5) === maxPriority);
    const currentGoal = candidates[candidates.length - 1];

    isProcessingRef.current = true;
    
    // Update Status
    setGoals(prev => prev.map(g => g.id === currentGoal.id ? { ...g, status: GoalStatus.ANALYZING } : g));
    addLog('THOUGHT', `Analyzing Goal: "${currentGoal.description}"`, `Depth: ${currentGoal.depth} | Priority: ${currentGoal.priority}`);

    try {
      // 2. Gemini Analysis (Is this a gap? Or solvable?)
      const analysis = await analyzeGoal(currentGoal, knowledgeContext, params);
      
      addLog('REASONING', `Analysis Complete. Gaps: ${analysis.hasKnowledgeGaps} (Confidence: ${analysis.analysisConfidence}%)`);
      
      if (analysis.hasKnowledgeGaps) {
        // 3a. Branching: Create Sub-goals
        if (currentGoal.depth >= params.recursionLimit) {
          // Fallback if too deep
          addLog('ERROR', 'Recursion limit reached. Attempting best-effort solution.');
           setGoals(prev => prev.map(g => g.id === currentGoal.id ? { 
            ...g, 
            status: GoalStatus.COMPLETED, 
            outcome: "Best effort logic applied due to depth limit.",
            reasoningTrace: analysis.reasoning,
            confidenceScore: analysis.analysisConfidence
          } : g));
        } else {
           // Create sub-goals
           const newSubGoals: AgentGoal[] = analysis.subGoals.map((sg: any) => ({
            id: uuidv4(),
            description: sg.description,
            status: GoalStatus.PENDING,
            parentId: currentGoal.id,
            depth: currentGoal.depth + 1,
            confidenceScore: sg.predictedConfidence || 50,
            priority: sg.priority || 5 // Default to 5 if not assigned
          }));
          
          setGoals(prev => {
            // Update current to REASONING (Waiting for kids)
            const updated = prev.map(g => g.id === currentGoal.id ? { 
              ...g, 
              status: GoalStatus.REASONING,
              reasoningTrace: analysis.reasoning,
              confidenceScore: analysis.analysisConfidence
            } : g);
            return [...updated, ...newSubGoals];
          });
          
          addLog('ACTION', `Spawned ${newSubGoals.length} sub-goals to bridge knowledge gaps.`);
        }

      } else {
        // 3b. Solved Directly
        setGoals(prev => prev.map(g => g.id === currentGoal.id ? { 
          ...g, 
          status: GoalStatus.COMPLETED, 
          outcome: analysis.directSolution,
          reasoningTrace: analysis.reasoning,
          confidenceScore: analysis.analysisConfidence
        } : g));
        
        addLog('ACTION', `Goal Solved: ${currentGoal.description}`);
        
        // Update Context (Knowledge Graph approximation)
        const summary = await synthesisStep([
          ...goals, 
          { ...currentGoal, outcome: analysis.directSolution }
        ], params);
        
        setKnowledgeContext(prev => `${prev}\n[New Fact]: ${analysis.directSolution.slice(0, 100)}...`);
      }

    } catch (error) {
      addLog('ERROR', `Cycle failed: ${error instanceof Error ? error.message : 'Unknown'}`);
      setGoals(prev => prev.map(g => g.id === currentGoal.id ? { ...g, status: GoalStatus.FAILED } : g));
      setIsRunning(false);
    } finally {
      isProcessingRef.current = false;
    }
  }, [goals, isRunning, params, knowledgeContext]);

  // -- Auto-runner --
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning) {
      interval = setInterval(() => {
        runAgentCycle();
      }, 2000); // 2s delay between thinking steps to be safe/visual
    }
    return () => clearInterval(interval);
  }, [isRunning, runAgentCycle]);


  // -- Handlers --
  const handleSetMainGoal = () => {
    if (!inputValue.trim()) return;
    
    const rootGoal: AgentGoal = {
      id: uuidv4(),
      description: inputValue,
      status: GoalStatus.PENDING,
      parentId: null,
      depth: 0,
      confidenceScore: 100,
      priority: 10 // Root goal is always max priority
    };

    setGoals([rootGoal]);
    setLogs([]);
    setKnowledgeContext("System Initialized. Goal Acquired.");
    setInputValue("");
    addLog('INFO', 'New Directive Received. Initializing Reasoning Loop.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
      
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur border-b border-slate-800 p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-cyan-500 rounded-full shadow-[0_0_10px_cyan]"></div>
          <h1 className="font-bold text-xl tracking-wider text-slate-100">NEXUS<span className="text-slate-500 font-light mx-2">|</span>AGENT</h1>
        </div>
        <div className="text-xs font-mono text-slate-500">
          VERSION 2.5.0 // REASONING_ENGINE_ACTIVE
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-grow p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden h-[calc(100vh-200px)]">
        
        {/* Left: Goal Input & Graph */}
        <section className="lg:col-span-4 flex flex-col gap-4 h-full">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-lg">
            <label className="block text-xs font-mono text-slate-400 mb-2 uppercase">Primary Directive</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSetMainGoal()}
                placeholder="E.g., Design a sustainable mars colony..."
                className="flex-grow bg-black border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <button 
                onClick={handleSetMainGoal}
                className="bg-slate-800 hover:bg-slate-700 text-cyan-400 px-4 py-2 rounded text-sm font-bold border border-slate-700"
              >
                SET
              </button>
            </div>
          </div>
          
          <GoalGraph goals={goals} />
        </section>

        {/* Right: Logs & Context */}
        <section className="lg:col-span-8 flex flex-col gap-4 h-full">
           {/* Knowledge Context Preview (Mini) */}
           <div className="h-1/4 bg-slate-900/50 border border-slate-800 rounded-xl p-4 overflow-y-auto">
             <h3 className="text-emerald-500 text-xs font-mono uppercase mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                Learned Context / Memory
             </h3>
             <p className="text-xs text-slate-400 font-mono leading-relaxed whitespace-pre-wrap">
               {knowledgeContext}
             </p>
           </div>
           
           {/* Terminal */}
           <div className="flex-grow overflow-hidden">
             <TerminalLog logs={logs} />
           </div>
        </section>

      </main>

      {/* Footer Control Interface */}
      <ControlPanel 
        params={params} 
        setParams={setParams} 
        isRunning={isRunning} 
        onToggle={() => setIsRunning(!isRunning)} 
      />

    </div>
  );
}