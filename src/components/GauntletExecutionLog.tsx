import React from 'react';
import { Terminal, CheckCircle, XCircle, Info, AlertCircle, Volume2 } from 'lucide-react';

interface GauntletExecutionLogProps {
  logs: string[];
  isRunning: boolean;
}

export const GauntletExecutionLog: React.FC<GauntletExecutionLogProps> = ({ logs, isRunning }) => {
  const getLogIcon = (log: string) => {
    if (log.includes('Error') || log.includes('Failed') || log.includes('defeated')) {
      return <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />;
    }
    if (log.includes('Success') || log.includes('Completed') || log.includes('Collected')) {
      return <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />;
    }
    if (log.includes('🔊') || log.includes('voice')) {
      return <Volume2 className="w-4 h-4 text-yellow-500 flex-shrink-0" />;
    }
    if (log.includes('⚠️') || log.includes('Warning')) {
      return <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0" />;
    }
    return <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />;
  };

  const getLogColor = (log: string) => {
    if (log.includes('Error') || log.includes('Failed') || log.includes('defeated')) {
      return 'text-red-700 bg-red-50 border-red-200';
    }
    if (log.includes('Success') || log.includes('Completed') || log.includes('Collected')) {
      return 'text-green-700 bg-green-50 border-green-200';
    }
    if (log.includes('🔊') || log.includes('voice')) {
      return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    }
    if (log.includes('⚠️') || log.includes('Warning')) {
      return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    }
    return 'text-blue-700 bg-blue-50 border-blue-200';
  };

  // Gauntlet-style voice announcements
  const getVoiceAnnouncement = (log: string) => {
    if (log.includes('🔊')) {
      return (
        <div className="absolute -top-10 left-0 right-0 bg-black bg-opacity-80 text-yellow-400 px-4 py-2 rounded-t-lg text-center font-bold animate-pulse">
          {log.split('🔊 ')[1].replace(/"/g, '')}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-2xl relative">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-green-400" />
          <span className="text-gray-300 font-medium">Gauntlet Execution Log</span>
          {isRunning && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm">Running</span>
            </div>
          )}
        </div>
      </div>

      {/* Log Content */}
      <div className="h-64 overflow-y-auto p-4 space-y-2 bg-gray-900">
        {logs.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No execution logs yet. Run your code to see output!</p>
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              className={`
                flex items-start space-x-2 p-2 rounded border text-sm relative
                ${getLogColor(log)}
              `}
            >
              {getLogIcon(log)}
              <span className="flex-1">{log}</span>
              {getVoiceAnnouncement(log)}
            </div>
          ))
        )}
      </div>

      {/* Gauntlet-style footer */}
      <div className="bg-black px-4 py-2 border-t border-gray-700 text-xs text-gray-400">
        <div className="flex justify-between">
          <span>Health decreases over time - find food!</span>
          <span>Destroy generators to stop enemies</span>
        </div>
      </div>
    </div>
  );
};