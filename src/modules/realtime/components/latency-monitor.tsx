"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWebSocketContext } from '@/contexts/WebSocketContext';

const LatencyMonitor: React.FC = () => {
  const { latency, isConnected } = useWebSocketContext();
  const [latencyHistory, setLatencyHistory] = useState<number[]>([]);
  const [avgLatency, setAvgLatency] = useState<number | null>(null);

  useEffect(() => {
    if (latency !== null && latency !== undefined) {
      setLatencyHistory((prev) => [...prev, latency].slice(-20));
    }
  }, [latency]);

  useEffect(() => {
    if (latencyHistory.length > 0) {
      const avg = latencyHistory.reduce((a, b) => a + b, 0) / latencyHistory.length;
      setAvgLatency(Math.round(avg));
    } else {
      setAvgLatency(null);
    }
  }, [latencyHistory]);

  const getLatencyStatus = (lat: number | null | undefined) => {
    if (lat === null || lat === undefined || !isConnected) return { color: 'gray', text: 'N/A' };
    if (lat < 50) return { color: 'green', text: 'Excellent' };
    if (lat < 100) return { color: 'blue', text: 'Good' };
    if (lat < 200) return { color: 'yellow', text: 'Fair' };
    return { color: 'red', text: 'Poor' };
  };

  const status = getLatencyStatus(latency);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          📊 Latency Monitor
          <Badge variant={isConnected ? "default" : "secondary"}>
            {status.text}
          </Badge>
        </CardTitle>
        <CardDescription>Real-time round-trip time (RTT) monitoring</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Current Latency</p>
            <p className="text-2xl font-bold">
              {latency !== null && latency !== undefined ? `${latency}ms` : '--'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Average Latency</p>
            <p className="text-2xl font-bold">
              {avgLatency !== null ? `${avgLatency}ms` : '--'}
            </p>
          </div>
        </div>

        {/* Simple Latency Bar Graph */}
        <div className="space-y-2">
          <p className="text-xs font-semibold">Recent History</p>
          <div className="flex items-end gap-1 h-16 bg-muted/30 rounded p-2">
            {latencyHistory.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground">
                {isConnected ? 'Collecting data...' : 'Connect to start monitoring'}
              </div>
            ) : (
              latencyHistory.map((lat, idx) => {
                const height = Math.min((lat / 300) * 100, 100);
                return (
                  <div
                    key={idx}
                    className={`flex-1 rounded-t transition-all ${
                      lat < 50
                        ? 'bg-green-500'
                        : lat < 100
                        ? 'bg-blue-500'
                        : lat < 200
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ height: `${height}%` }}
                    title={`${lat}ms`}
                  />
                );
              })
            )}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0ms</span>
            <span>300ms+</span>
          </div>
        </div>

        {!isConnected && (
          <div className="text-center text-sm text-muted-foreground bg-muted/50 rounded p-3">
            Connect to a WebSocket server to start monitoring latency
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LatencyMonitor;
