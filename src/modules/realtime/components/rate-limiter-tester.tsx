"use client";
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useWebSocketContext } from '@/contexts/WebSocketContext';

const RateLimiterTester: React.FC = () => {
  const { isConnected, sendMessage } = useWebSocketContext();
  const [messagesPerSecond, setMessagesPerSecond] = useState(10);
  const [duration, setDuration] = useState(5);
  const [isTesting, setIsTesting] = useState(false);
  const [stats, setStats] = useState({ sent: 0, failed: 0, total: 0 });
  const testIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRateLimitTest = () => {
    if (!isConnected) return;

    setIsTesting(true);
    setStats({ sent: 0, failed: 0, total: messagesPerSecond * duration });

    const intervalMs = 1000 / messagesPerSecond;
    const endTime = Date.now() + duration * 1000;
    let sentCount = 0;
    let failedCount = 0;

    testIntervalRef.current = setInterval(() => {
      if (Date.now() >= endTime) {
        stopRateLimitTest();
        return;
      }

      const testPayload = JSON.stringify({
        type: 'rate-limit-test',
        timestamp: Date.now(),
        messageId: sentCount + 1,
      });

      const success = sendMessage(testPayload);
      if (success) {
        sentCount++;
      } else {
        failedCount++;
      }

      setStats({ sent: sentCount, failed: failedCount, total: messagesPerSecond * duration });
    }, intervalMs);
  };

  const stopRateLimitTest = () => {
    if (testIntervalRef.current) {
      clearInterval(testIntervalRef.current);
      testIntervalRef.current = null;
    }
    setIsTesting(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          ⚡ Rate Limiting Tester
          {isTesting && <Badge variant="destructive">Testing...</Badge>}
        </CardTitle>
        <CardDescription>
          Test server rate limits by sending messages at controlled speeds
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rate">Messages per second</Label>
            <Input
              id="rate"
              type="number"
              min="1"
              max="1000"
              value={messagesPerSecond}
              onChange={(e) => setMessagesPerSecond(Number(e.target.value))}
              disabled={isTesting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (seconds)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              max="60"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              disabled={isTesting}
            />
          </div>
        </div>

        <div className="flex gap-2">
          {!isTesting ? (
            <Button onClick={startRateLimitTest} disabled={!isConnected} className="flex-1">
              Start Rate Limit Test
            </Button>
          ) : (
            <Button onClick={stopRateLimitTest} variant="destructive" className="flex-1">
              Stop Test
            </Button>
          )}
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setMessagesPerSecond(5);
              setDuration(5);
            }}
            disabled={isTesting}
          >
            Low (5/s)
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setMessagesPerSecond(50);
              setDuration(5);
            }}
            disabled={isTesting}
          >
            Medium (50/s)
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setMessagesPerSecond(100);
              setDuration(5);
            }}
            disabled={isTesting}
          >
            High (100/s)
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setMessagesPerSecond(500);
              setDuration(3);
            }}
            disabled={isTesting}
          >
            Extreme (500/s)
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.sent}</p>
            <p className="text-xs text-muted-foreground">Sent</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            <p className="text-xs text-muted-foreground">Failed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Target</p>
          </div>
        </div>

        {stats.sent > 0 && (
          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Success Rate: <span className="font-bold">{((stats.sent / (stats.sent + stats.failed)) * 100).toFixed(1)}%</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RateLimiterTester;
