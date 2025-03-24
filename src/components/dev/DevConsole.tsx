
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { restoreConsole, initDevErrorHandler } from '@/utils/devErrorHandler';
import { getRecentLogs, clearLogs, LogLevel } from '@/utils/logger';
import { AlertTriangle, Bug, RefreshCw, X } from 'lucide-react';
import LogsPanel from './LogsPanel';

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
  
  // Count logs by level for tab labels
  const errorLogsCount = logs.filter(log => log.level === LogLevel.ERROR).length;
  const warnLogsCount = logs.filter(log => log.level === LogLevel.WARN).length;
  const infoLogsCount = logs.filter(log => log.level === LogLevel.INFO).length;
  const debugLogsCount = logs.filter(log => log.level === LogLevel.DEBUG).length;
  
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
            All ({logs.length})
          </TabsTrigger>
        </TabsList>
        
        <ScrollArea className="flex-1 p-2">
          <TabsContent value="errors" className="mt-0">
            <LogsPanel logs={logs} type="errors" />
          </TabsContent>
          
          <TabsContent value="warnings" className="mt-0">
            <LogsPanel logs={logs} type="warnings" />
          </TabsContent>
          
          <TabsContent value="info" className="mt-0">
            <LogsPanel logs={logs} type="info" />
          </TabsContent>
          
          <TabsContent value="debug" className="mt-0">
            <LogsPanel logs={logs} type="debug" />
          </TabsContent>
          
          <TabsContent value="all" className="mt-0">
            <LogsPanel logs={logs} type="all" />
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

export default DevConsole;
