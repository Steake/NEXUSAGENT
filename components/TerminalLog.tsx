import React, { useEffect, useRef } from 'react';
import { AgentLog } from '../types';

interface Props {
  logs: AgentLog[];
}

export const TerminalLog: React.FC<Props> = ({ logs }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="h-64 md:h-full bg-black border border-slate-800 rounded-xl p-4 font-mono text-xs overflow-y-auto flex flex-col shadow-inner">
      <div className="text-slate-500 mb-2 sticky top-0 bg-black pb-2 border-b border-slate-900">
        > SYSTEM_STREAM // MONITORING
      </div>
      <div className="flex-grow space-y-2">
        {logs.map((log) => (
          <div key={log.id} className="flex gap-2 opacity-90 hover:opacity-100 transition-opacity">
            <span className="text-slate-600 shrink-0">
              [{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second:'2-digit' })}]
            </span>
            <span className={`shrink-0 font-bold w-16 ${
              log.type === 'ERROR' ? 'text-red-500' :
              log.type === 'THOUGHT' ? 'text-purple-400' :
              log.type === 'ACTION' ? 'text-cyan-400' :
              'text-slate-400'
            }`}>
              {log.type}
            </span>
            <span className="text-slate-300 whitespace-pre-wrap break-words">
              {log.message}
            </span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
};