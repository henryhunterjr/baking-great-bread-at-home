
import React, { useState } from 'react';
import { LogLevel } from '@/utils/logger';
import { AlertCircle, AlertTriangle, Info, Bug, ChevronDown, ChevronRight } from 'lucide-react';

interface LogEntryProps {
  log: {
    timestamp: number;
    level: LogLevel;
    message: string;
    data?: any;
  };
}

const LogEntry: React.FC<LogEntryProps> = ({ log }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Format the timestamp
  const formattedTime = new Date(log.timestamp).toLocaleTimeString();
  
  // Determine log level icon and color
  const getLevelStyles = () => {
    switch (log.level) {
      case LogLevel.ERROR:
        return { 
          icon: <AlertCircle className="h-4 w-4" />, 
          color: 'text-red-500 bg-red-50 dark:bg-red-900/20' 
        };
      case LogLevel.WARN:
        return { 
          icon: <AlertTriangle className="h-4 w-4" />, 
          color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' 
        };
      case LogLevel.INFO:
        return { 
          icon: <Info className="h-4 w-4" />, 
          color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' 
        };
      case LogLevel.DEBUG:
        return { 
          icon: <Bug className="h-4 w-4" />, 
          color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' 
        };
      default:
        return { 
          icon: <Info className="h-4 w-4" />, 
          color: 'text-gray-500 bg-gray-50 dark:bg-gray-900/20' 
        };
    }
  };
  
  const { icon, color } = getLevelStyles();
  
  // Check if this log entry has expandable data
  const hasData = log.data && Object.keys(log.data).length > 0;
  
  return (
    <div className={`rounded-md p-2 text-xs ${color}`}>
      <div className="flex items-start">
        <div className="mr-2 mt-0.5">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <span className="font-medium">{formattedTime}</span>
            {hasData && (
              <button 
                onClick={() => setExpanded(!expanded)}
                className="ml-2 focus:outline-none"
              >
                {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            )}
          </div>
          <div className="mt-1 font-mono whitespace-pre-wrap">
            {log.message}
          </div>
          
          {expanded && hasData && (
            <pre className="mt-2 p-2 bg-black/5 rounded overflow-auto max-h-32">
              {JSON.stringify(log.data, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogEntry;
