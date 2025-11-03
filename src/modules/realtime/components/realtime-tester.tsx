"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useWebSocketContext } from '@/contexts/WebSocketContext';

const RealtimeTester: React.FC = () => {
  const { isConnected, messages, sendMessage, clearMessages } = useWebSocketContext();
  const [testMessage, setTestMessage] = useState('');

  const handleSend = () => {
    if (testMessage.trim() && isConnected) {
      sendMessage(testMessage);
      setTestMessage('');
    }
  };

  const sendTestData = (type: string) => {
    const testPayloads: Record<string, string> = {
      json: JSON.stringify({ event: 'test', data: 'Hello World', timestamp: Date.now() }),
      stream: JSON.stringify({ type: 'stream', value: Math.random() * 100 }),
      alert: JSON.stringify({ type: 'alert', level: 'warning', message: 'Test alert' }),
      metrics: JSON.stringify({ cpu: 45, memory: 72, requests: 1234 }),
    };
    sendMessage(testPayloads[type] || 'Test message');
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          WebSocket Tester
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </Badge>
        </CardTitle>
        <CardDescription>
          Send manual messages and view live WebSocket communication logs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Test Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => sendTestData('json')}
            disabled={!isConnected}
          >
            Send JSON
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => sendTestData('stream')}
            disabled={!isConnected}
          >
            Send Stream Data
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => sendTestData('alert')}
            disabled={!isConnected}
          >
            Send Alert
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => sendTestData('metrics')}
            disabled={!isConnected}
          >
            Send Metrics
          </Button>
        </div>

        {/* Custom Message Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={!isConnected}
          />
          <Button onClick={handleSend} disabled={!isConnected}>
            Send
          </Button>
        </div>

        {/* Message Log */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-semibold">Message Log ({messages.length})</h4>
            <Button size="sm" variant="ghost" onClick={clearMessages}>
              Clear
            </Button>
          </div>
          <ScrollArea className="h-64 w-full rounded-md border p-4">
            <div className="space-y-2">
              {messages.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No messages yet. Connect and start testing!
                </p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-2 rounded text-xs font-mono ${
                      msg.type === 'sent'
                        ? 'bg-blue-50 dark:bg-blue-950 border-l-2 border-blue-500'
                        : 'bg-green-50 dark:bg-green-950 border-l-2 border-green-500'
                    }`}
                  >
                    <div className="flex justify-between mb-1">
                      <Badge variant={msg.type === 'sent' ? 'default' : 'secondary'} className="text-xs">
                        {msg.type === 'sent' ? '↑ SENT' : '↓ RECEIVED'}
                      </Badge>
                      <span className="text-muted-foreground">{formatTimestamp(msg.timestamp)}</span>
                    </div>
                    <pre className="whitespace-pre-wrap break-all">{msg.data}</pre>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealtimeTester;
