import React from 'react';
import { SystemParameters } from '../types';
import { MAX_THINKING_BUDGET, MIN_THINKING_BUDGET } from '../constants';

interface Props {
  params: SystemParameters;
  setParams: React.Dispatch<React.SetStateAction<SystemParameters>>;
  isRunning: boolean;
  onToggle: () => void;
}

export const ControlPanel: React.FC<Props> = ({ params, setParams, isRunning, onToggle }) => {
  
  const handleChange = (key: keyof SystemParameters, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-slate-900 border-t border-slate-700 p-6 sticky bottom-0 z-50 shadow-2xl shadow-slate-900">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-center">
        
        {/* Main Activator */}
        <div className="flex-shrink-0">
          <button
            onClick={onToggle}
            className={`w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${
              isRunning 
                ? 'border-emerald-500 bg-emerald-900/20 shadow-[0_0_30px_rgba(16,185,129,0.3)]' 
                : 'border-slate-600 bg-slate-800 hover:border-slate-500'
            }`}
          >
            <div className={`text-2xl font-bold ${isRunning ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`}>
              {isRunning ? 'ON' : 'OFF'}
            </div>
          </button>
          <div className="text-center mt-2 text-xs text-slate-500 font-mono tracking-widest">SYSTEM STATE</div>
        </div>

        {/* The Erbingham Interface Sliders */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          
          {/* Alpha: Temperature */}
          <div className="group">
            <div className="flex justify-between text-xs font-mono mb-2 text-cyan-400">
              <span>α (ALPHA): PLASTICITY</span>
              <span>{params.alpha.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={params.alpha}
              onChange={(e) => handleChange('alpha', parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">Controls creativity and search divergence.</p>
          </div>

          {/* Beta: Thinking Budget */}
          <div className="group">
            <div className="flex justify-between text-xs font-mono mb-2 text-purple-400">
              <span>β (BETA): REASONING DEPTH</span>
              <span>{params.beta} Tokens</span>
            </div>
            <input
              type="range"
              min={MIN_THINKING_BUDGET}
              max={MAX_THINKING_BUDGET}
              step="1024"
              value={params.beta}
              onChange={(e) => handleChange('beta', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">Allocated cognitive budget for chain-of-thought.</p>
          </div>

          {/* Gamma: Retention/Context - Visual only in this demo logic, but implies concept */}
          <div className="group">
            <div className="flex justify-between text-xs font-mono mb-2 text-amber-400">
              <span>γ (GAMMA): RETENTION</span>
              <span>{params.gamma.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={params.gamma}
              onChange={(e) => handleChange('gamma', parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">Goal persistence and memory decay factor.</p>
          </div>

        </div>
      </div>
    </div>
  );
};