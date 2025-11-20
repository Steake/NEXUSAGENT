import React, { useState } from 'react';
import { AgentGoal, GoalStatus } from '../types';

interface Props {
  goals: AgentGoal[];
}

export const GoalGraph: React.FC<Props> = ({ goals }) => {
  const [expandedTraces, setExpandedTraces] = useState<Set<string>>(new Set());

  const toggleTrace = (id: string) => {
    setExpandedTraces(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };
  
  const getStatusColor = (status: GoalStatus) => {
    switch (status) {
      case GoalStatus.COMPLETED: return 'border-emerald-500 bg-emerald-950/30 text-emerald-200';
      case GoalStatus.ANALYZING: return 'border-cyan-500 bg-cyan-950/30 text-cyan-200 animate-pulse';
      case GoalStatus.REASONING: return 'border-purple-500 bg-purple-950/30 text-purple-200 animate-pulse';
      case GoalStatus.FAILED: return 'border-red-500 bg-red-950/30 text-red-200';
      default: return 'border-slate-600 bg-slate-800 text-slate-300';
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score > 80) return 'bg-green-900/40 border-green-500/50 text-green-400';
    if (score >= 50) return 'bg-yellow-900/40 border-yellow-500/50 text-yellow-400';
    return 'bg-red-900/40 border-red-500/50 text-red-400';
  };

  const renderNode = (goal: AgentGoal) => {
    const children = goals.filter(g => g.parentId === goal.id);

    // Truncate reasoning trace logic
    const isExpanded = expandedTraces.has(goal.id);
    const fullTrace = goal.reasoningTrace || '';
    const isLongTrace = fullTrace.length > 100;
    
    const displayTrace = (isLongTrace && !isExpanded)
      ? `${fullTrace.slice(0, 100)}...` 
      : fullTrace;

    return (
      <div key={goal.id} className="ml-6 mt-4">
        <div className={`
          p-3 rounded border-l-2 backdrop-blur-sm transition-all duration-300
          ${getStatusColor(goal.status)}
        `}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs opacity-50">ID: {goal.id.slice(0,4)}</span>
            
            <div className="flex items-center gap-2">
                {/* Priority Badge */}
                <div className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-slate-600 bg-slate-800 text-orange-300" title="Priority Level">
                  P:{goal.priority ?? 5}
                </div>

                {/* Confidence Badge */}
                <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded border flex items-center gap-1 ${getConfidenceColor(goal.confidenceScore)}`}>
                    <span>CONF:</span>
                    <span>{goal.confidenceScore}%</span>
                </div>
                
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/20 border border-white/10 uppercase tracking-wide">
                  {goal.status}
                </span>
            </div>
          </div>
          
          <div className="mt-1 font-medium text-sm">{goal.description}</div>
          
          {goal.reasoningTrace && (
            <div 
              className={`mt-2 text-xs opacity-70 pl-2 border-l border-white/20 italic transition-colors select-none ${isLongTrace ? 'cursor-pointer hover:text-white hover:border-cyan-400' : ''}`}
              title={isLongTrace ? (isExpanded ? "Click to collapse" : "Click to expand") : ""}
              onClick={() => isLongTrace && toggleTrace(goal.id)}
            >
              "{displayTrace}"
            </div>
          )}
           {goal.outcome && (
            <div className="mt-2 text-xs text-emerald-300 bg-emerald-900/20 p-2 rounded border border-emerald-900/50">
              ✓ {goal.outcome}
            </div>
          )}
        </div>
        {children.length > 0 && (
          <div className="border-l border-slate-700 ml-4 pl-2">
            {children.map(renderNode)}
          </div>
        )}
      </div>
    );
  };

  const rootGoals = goals.filter(g => !g.parentId);

  return (
    <div className="h-full overflow-y-auto p-4 bg-slate-900/50 rounded-xl border border-slate-800 shadow-inner">
      <h3 className="text-slate-400 text-xs font-mono uppercase tracking-widest mb-4 sticky top-0 bg-slate-900/90 py-2 backdrop-blur z-10">
        Active Goal Topology
      </h3>
      {rootGoals.length === 0 ? (
        <div className="text-slate-600 text-center mt-10 italic">No active directives. Initialize system.</div>
      ) : (
        rootGoals.map(renderNode)
      )}
    </div>
  );
};