
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import LogEntry from './LogEntry';
import { LogLevel } from '@/utils/logger';

interface LogsPanelProps {
  logs: Array<{
    timestamp: string;
    level: LogLevel;
    message: string;
    context?: Record<string, any>;
  }>;
  type: 'errors' | 'warnings' | 'info' | 'debug' | 'all';
}

const LogsPanel: React.FC<LogsPanelProps> = ({ logs, type }) => {
  // Filter logs based on type
  const filteredLogs = type === 'all' 
    ? logs 
    : logs.filter(log => {
        switch (type) {
          case 'errors': return log.level === LogLevel.ERROR;
          case 'warnings': return log.level === LogLevel.WARN;
          case 'info': return log.level === LogLevel.INFO;
          case 'debug': return log.level === LogLevel.DEBUG;
          default: return false;
        }
      });
  
  if (filteredLogs.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          {type === 'all' 
            ? 'No logs recorded' 
            : `No ${type} logged`}
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-2">
      {filteredLogs.map((log, i) => (
        <LogEntry key={i} log={log} />
      ))}
    </div>
  );
};

export default LogsPanel;
