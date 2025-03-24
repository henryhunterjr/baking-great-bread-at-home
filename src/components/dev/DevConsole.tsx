
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { restoreConsole, initDevErrorHandler } from '@/utils/devErrorHandler';
import { getRecentLogs, clearLogs, LogLevel } from '@/utils/logger';
import { AlertTriangle, Bug, RefreshCw, X } from 'lucide-react';

interface DevConsoleProps {
  onClose: () => void;
}

const DevConsole: React.FC<DevConsoleProps> = ({ onClose }) => {
  const [logs, setLogs] = useState(getRecentLogs());
  const [errorFiltering, setErrorFiltering] = useState(true);
  
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
  
  // Filter logs by level
  const errorLogs = logs.filter(log => log.level === LogLevel.ERROR);
  const warnLogs = logs.filter(log => log.level === LogLevel.WARN);
  const infoLogs = logs.filter(log => log.level === LogLevel.INFO);
  const debugLogs = logs.filter(log => log.level === LogLevel.DEBUG);
  
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
            Errors ({errorLogs.length})
          </TabsTrigger>
          <TabsTrigger value="warnings" className="text-xs">
            Warnings ({warnLogs.length})
          </TabsTrigger>
          <TabsTrigger value="info" className="text-xs">
            Info ({infoLogs.length})
          </TabsTrigger>
          <TabsTrigger value="debug" className="text-xs">
            Debug ({debugLogs.length})
          </TabsTrigger>
          <TabsTrigger value="all" className="text-xs">
            All ({logs.length})
          </TabsTrigger>
        </TabsList>
        
        <ScrollArea className="flex-1 p-2">
          <TabsContent value="errors" className="mt-0">
            {errorLogs.length === 0 ? (
              <Alert>
                <AlertDescription>No errors logged</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2">
                {errorLogs.map((log, i) => (
                  <LogEntry key={i} log={log} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="warnings" className="mt-0">
            {warnLogs.length === 0 ? (
              <Alert>
                <AlertDescription>No warnings logged</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2">
                {warnLogs.map((log, i) => (
                  <LogEntry key={i} log={log} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="info" className="mt-0">
            {infoLogs.length === 0 ? (
              <Alert>
                <AlertDescription>No info logs</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2">
                {infoLogs.map((log, i) => (
                  <LogEntry key={i} log={log} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="debug" className="mt-0">
            {debugLogs.length === 0 ? (
              <Alert>
                <AlertDescription>No debug logs</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2">
                {debugLogs.map((log, i) => (
                  <LogEntry key={i} log={log} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="all" className="mt-0">
            {logs.length === 0 ? (
              <Alert>
                <AlertDescription>No logs recorded</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2">
                {logs.map((log, i) => (
                  <LogEntry key={i} log={log} />
                ))}
              </div>
            )}
          </TabsContent>
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

interface LogEntryProps {
  log: ReturnType<typeof getRecentLogs>[0];
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

export default DevConsole;
