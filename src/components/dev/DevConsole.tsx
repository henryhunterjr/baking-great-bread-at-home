
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { restoreConsole, initDevErrorHandler } from '@/utils/devErrorHandler';
import { getRecentLogs, clearLogs, LogLevel, LogEntry } from '@/utils/logger';
import { AlertTriangle, Bug, RefreshCw, X, WifiOff } from 'lucide-react';

interface DevConsoleProps {
  onClose: () => void;
}

const DevConsole: React.FC<DevConsoleProps> = ({ onClose }) => {
  const [logs, setLogs] = useState<LogEntry[]>(getRecentLogs());
  const [errorFiltering, setErrorFiltering] = useState(true);
  const [hideWebSocketErrors, setHideWebSocketErrors] = useState(true);
  
  // Update logs every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setLogs(getRecentLogs());
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const toggleErrorFiltering = () => {
    if (errorFiltering) {
      restoreConsole();
    } else {
      initDevErrorHandler(true);
    }
    setErrorFiltering(!errorFiltering);
  };
  
  const clearLogHistory = () => {
    clearLogs();
    setLogs([]);
  };
  
  // Filter WebSocket errors if requested
  const filteredLogs = hideWebSocketErrors 
    ? logs.filter(log => !log.message.includes('WebSocket'))
    : logs;
  
  // Count logs by level for tab labels
  const errorLogsCount = filteredLogs.filter(log => log.level === LogLevel.ERROR).length;
  const warnLogsCount = filteredLogs.filter(log => log.level === LogLevel.WARN).length;
  const infoLogsCount = filteredLogs.filter(log => log.level === LogLevel.INFO).length;
  const debugLogsCount = filteredLogs.filter(log => log.level === LogLevel.DEBUG).length;
  
  return (
    <div className="fixed bottom-4 right-4 w-[600px] h-[400px] bg-background border rounded-lg shadow-lg z-50 flex flex-col">
      <div className="flex items-center justify-between p-2 border-b">
        <div className="flex items-center">
          <Bug className="h-5 w-5 mr-2 text-primary" />
          <h3 className="text-sm font-medium">Developer Console</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setHideWebSocketErrors(!hideWebSocketErrors)}
            className={hideWebSocketErrors ? "bg-red-100/20" : ""}
          >
            <WifiOff className="h-4 w-4 mr-1" />
            {hideWebSocketErrors ? "Show WS Errors" : "Hide WS Errors"}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleErrorFiltering}
            className={errorFiltering ? "bg-primary/20" : ""}
          >
            {errorFiltering ? "Show All Errors" : "Filter Dev Errors"}
          </Button>
          <Button variant="outline" size="sm" onClick={clearLogHistory}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="errors" className="flex-1">
        <TabsList className="px-2 pt-2">
          <TabsTrigger value="errors" className="text-xs">
            Errors ({errorLogsCount})
          </TabsTrigger>
          <TabsTrigger value="warnings" className="text-xs">
            Warnings ({warnLogsCount})
          </TabsTrigger>
          <TabsTrigger value="info" className="text-xs">
            Info ({infoLogsCount})
          </TabsTrigger>
          <TabsTrigger value="debug" className="text-xs">
            Debug ({debugLogsCount})
          </TabsTrigger>
          <TabsTrigger value="all" className="text-xs">
            All ({filteredLogs.length})
          </TabsTrigger>
        </TabsList>
        
        <ScrollArea className="flex-1 p-2">
          <div className="space-y-2">
            {filteredLogs.map((log, index) => (
              <div 
                key={`${log.timestamp}-${index}`}
                className={`rounded p-2 text-xs ${
                  log.level === LogLevel.ERROR ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 
                  log.level === LogLevel.WARN ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' : 
                  log.level === LogLevel.INFO ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
                  'bg-gray-50 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400'
                }`}
              >
                <div className="flex justify-between">
                  <span className="font-medium">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  <span className="text-xs opacity-70">{log.level}</span>
                </div>
                <div className="mt-1 font-mono whitespace-pre-wrap">{log.message}</div>
                {log.context && (
                  <div className="mt-1 text-xs opacity-70">
                    {JSON.stringify(log.context)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </Tabs>
      
      <Alert className="m-2">
        <AlertTriangle className="h-4 w-4 mr-2" />
        <AlertDescription className="text-xs">
          WebSocket and CORS errors are normal during development and don't affect your app functionality.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default DevConsole;
