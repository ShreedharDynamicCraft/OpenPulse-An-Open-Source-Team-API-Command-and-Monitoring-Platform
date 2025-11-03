"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useWebSocketContext } from '@/contexts/WebSocketContext';

const RealtimeConnectionManager: React.FC = () => {
  const { isConnected, connectionUrl, setConnectionUrl, connect, disconnect } = useWebSocketContext();
  const [urlInput, setUrlInput] = useState('ws://localhost:8080');

  const handleConnect = () => {
    if (urlInput.trim()) {
      setConnectionUrl(urlInput);
      connect(urlInput);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleQuickConnect = (url: string) => {
    setUrlInput(url);
    setConnectionUrl(url);
    connect(url);
  };

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="flex items-center gap-2">
        <Badge variant={isConnected ? "default" : "secondary"} className="text-sm">
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </Badge>
        {isConnected && connectionUrl && (
          <span className="text-xs text-muted-foreground truncate">
            {connectionUrl}
          </span>
        )}
      </div>

      {/* Connection Controls */}
      <div className="flex gap-2">
        <Input
          placeholder="ws://localhost:8080"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isConnected && handleConnect()}
          disabled={isConnected}
          className="flex-1"
        />
        {!isConnected ? (
          <Button onClick={handleConnect} disabled={!urlInput.trim()}>
            Connect
          </Button>
        ) : (
          <Button onClick={handleDisconnect} variant="destructive">
            Disconnect
          </Button>
        )}
      </div>

      {/* Quick Connect Presets */}
      {!isConnected && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground mr-2">Quick connect:</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleQuickConnect('ws://localhost:8080')}
          >
            Local (8080)
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleQuickConnect('ws://localhost:3001')}
          >
            Local (3001)
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleQuickConnect('wss://echo.websocket.org')}
          >
            Echo Server
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleQuickConnect('wss://ws.postman-echo.com/raw')}
          >
            Postman Echo
          </Button>
        </div>
      )}
    </div>
  );
};

export default RealtimeConnectionManager;
