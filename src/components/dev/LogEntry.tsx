
import React, { useState } from 'react';
import { LogLevel } from '@/utils/logger';

interface LogEntryProps {
  log: {
    timestamp: string;
    level: LogLevel;
    message: string;
    context?: Record<string, any>;
  };
}

const LogEntry: React.FC<LogEntryProps> = ({ log }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Determine background color based on log level
  let bgColor = 'bg-secondary';
  if (log.level === LogLevel.ERROR) bgColor = 'bg-destructive/20';
  if (log.level === LogLevel.WARN) bgColor = 'bg-warning/20';
  if (log.level === LogLevel.DEBUG) bgColor = 'bg-muted';
  
  return (
    <div className={`p-2 rounded text-xs ${bgColor}`} onClick={() => setExpanded(!expanded)}>
      <div className="flex justify-between">
        <span className="font-mono">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
        <span className="uppercase text-[10px] px-1 rounded">{log.level}</span>
      </div>
      <div className="font-medium mt-1">{log.message}</div>
      {expanded && log.context && (
        <pre className="mt-2 p-2 bg-muted rounded overflow-x-auto text-[10px]">
          {JSON.stringify(log.context, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default LogEntry;
