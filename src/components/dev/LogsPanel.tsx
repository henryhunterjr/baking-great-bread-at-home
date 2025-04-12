
import React from 'react';
import { LogLevel } from '@/utils/logger';
import LogEntry from './LogEntry';

interface LogsPanelProps {
  logs: Array<{
    timestamp: number;
    level: LogLevel;
    message: string;
    data?: any;
  }>;
  type: 'errors' | 'warnings' | 'info' | 'debug' | 'all';
}

const LogsPanel: React.FC<LogsPanelProps> = ({ logs, type }) => {
  // Filter logs based on type
  const filteredLogs = logs.filter(log => {
    if (type === 'all') return true;
    if (type === 'errors' && log.level === LogLevel.ERROR) return true;
    if (type === 'warnings' && log.level === LogLevel.WARN) return true;
    if (type === 'info' && log.level === LogLevel.INFO) return true;
    if (type === 'debug' && log.level === LogLevel.DEBUG) return true;
    return false;
  });
  
  if (filteredLogs.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic p-4 text-center">
        No {type} logs to display.
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {filteredLogs.map((log, index) => (
        <LogEntry key={`${log.timestamp}-${index}`} log={log} />
      ))}
    </div>
  );
};

export default LogsPanel;
