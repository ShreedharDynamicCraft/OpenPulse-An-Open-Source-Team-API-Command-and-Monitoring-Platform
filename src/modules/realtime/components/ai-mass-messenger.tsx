"use client";
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useWebSocketContext } from '@/contexts/WebSocketContext';

// Mock AI message generator
const generateAIMessage = async (template: string, index: number): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 50)); // Simulate API delay

  const variations = [
    `User query: ${template} - Request #${index}`,
    `AI Analysis: Processing ${template} [Batch ${index}]`,
    `Event: ${template} detected at ${new Date().toISOString()}`,
    `Notification: ${template} - Priority: ${index % 3 === 0 ? 'High' : 'Normal'}`,
    `Update: ${template} - Status: ${index % 2 === 0 ? 'Success' : 'Pending'}`,
  ];

  const variation = variations[index % variations.length];
  
  return JSON.stringify({
    type: 'ai-generated',
    content: variation,
    timestamp: Date.now(),
    id: `ai-msg-${index}`,
    metadata: {
      temperature: Math.random(),
      confidence: (Math.random() * 0.5 + 0.5).toFixed(2),
    }
  });
};

const AIMassMessenger: React.FC = () => {
  const { isConnected, sendMessage } = useWebSocketContext();
  const [messageTemplate, setMessageTemplate] = useState('Test event');
  const [messageCount, setMessageCount] = useState(100);
  const [delayMs, setDelayMs] = useState(100);
  const [isSending, setIsSending] = useState(false);
  const [progress, setProgress] = useState({ sent: 0, total: 0 });
  const abortRef = useRef(false);

  const startMassMessaging = async () => {
    if (!isConnected) return;

    setIsSending(true);
    setProgress({ sent: 0, total: messageCount });
    abortRef.current = false;

    for (let i = 0; i < messageCount; i++) {
      if (abortRef.current) break;

      try {
        const aiMessage = await generateAIMessage(messageTemplate, i + 1);
        sendMessage(aiMessage);
        setProgress({ sent: i + 1, total: messageCount });

        if (delayMs > 0) {
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      } catch (error) {
        console.error('Failed to generate message:', error);
      }
    }

    setIsSending(false);
  };

  const stopMassMessaging = () => {
    abortRef.current = true;
    setIsSending(false);
  };

  const progressPercentage = progress.total > 0 ? (progress.sent / progress.total) * 100 : 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          🤖 AI Mass Messenger
          {isSending && <Badge variant="default">Sending...</Badge>}
        </CardTitle>
        <CardDescription>
          Generate and send AI-powered mass messages for load testing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="template">Message Template</Label>
          <Textarea
            id="template"
            placeholder="Enter message template (AI will generate variations)..."
            value={messageTemplate}
            onChange={(e) => setMessageTemplate(e.target.value)}
            disabled={isSending}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="count">Number of Messages</Label>
            <Input
              id="count"
              type="number"
              min="1"
              max="10000"
              value={messageCount}
              onChange={(e) => setMessageCount(Number(e.target.value))}
              disabled={isSending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="delay">Delay (ms)</Label>
            <Input
              id="delay"
              type="number"
              min="0"
              max="5000"
              value={delayMs}
              onChange={(e) => setDelayMs(Number(e.target.value))}
              disabled={isSending}
            />
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setMessageCount(50);
              setDelayMs(100);
            }}
            disabled={isSending}
          >
            Small Batch (50)
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setMessageCount(500);
              setDelayMs(50);
            }}
            disabled={isSending}
          >
            Medium Batch (500)
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setMessageCount(1000);
              setDelayMs(10);
            }}
            disabled={isSending}
          >
            Large Batch (1000)
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setMessageCount(100);
              setDelayMs(0);
            }}
            disabled={isSending}
          >
            Rapid Fire (No delay)
          </Button>
        </div>

        <div className="flex gap-2">
          {!isSending ? (
            <Button onClick={startMassMessaging} disabled={!isConnected || !messageTemplate} className="flex-1">
              🚀 Start AI Mass Messaging
            </Button>
          ) : (
            <Button onClick={stopMassMessaging} variant="destructive" className="flex-1">
              ⏹️ Stop Messaging
            </Button>
          )}
        </div>

        {/* Progress Bar */}
        {(isSending || progress.sent > 0) && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold">{progress.sent} / {progress.total}</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-xs text-center text-muted-foreground">
              {progressPercentage.toFixed(1)}% Complete
            </p>
          </div>
        )}

        {/* Stats */}
        {progress.sent > 0 && !isSending && (
          <div className="text-center p-4 bg-secondary rounded-lg">
            <p className="text-lg font-bold text-green-600">✅ Complete!</p>
            <p className="text-sm text-muted-foreground">
              Sent {progress.sent} AI-generated messages successfully
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIMassMessenger;
