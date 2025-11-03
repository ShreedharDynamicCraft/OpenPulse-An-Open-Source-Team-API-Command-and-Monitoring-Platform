"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useWebSocketContext } from '@/contexts/WebSocketContext';

interface Message {
  id: string;
  timestamp: number;
  type: 'sent' | 'received';
  data: string;
}

interface Analysis {
  id: string;
  timestamp: number;
  summary: string;
  insights: string[];
  anomalies: string[];
}

const analyzeWithGemini = async (messages: Message[]): Promise<Analysis> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const recentMessages = messages.slice(-10);
  const messageCount = recentMessages.length;
  const sentCount = recentMessages.filter((m) => m.type === 'sent').length;
  const receivedCount = recentMessages.filter((m) => m.type === 'received').length;

  // Mock analysis based on message patterns
  const insights = [];
  const anomalies = [];

  if (sentCount > receivedCount * 2) {
    anomalies.push('High outbound message rate detected');
  }

  if (messageCount > 5) {
    insights.push(`Active communication with ${messageCount} recent messages`);
  }

  try {
    const jsonMessages = recentMessages.filter((m) => {
      try {
        JSON.parse(m.data);
        return true;
      } catch {
        return false;
      }
    });

    if (jsonMessages.length > 0) {
      insights.push(`${jsonMessages.length} structured JSON messages detected`);
    }
  } catch (e) {
    // Ignore parsing errors
  }

  return {
    id: `analysis-${Date.now()}`,
    timestamp: Date.now(),
    summary: `Analyzed ${messageCount} messages. Communication appears ${
      anomalies.length > 0 ? 'irregular' : 'normal'
    }.`,
    insights: insights.length > 0 ? insights : ['No significant patterns detected'],
    anomalies: anomalies.length > 0 ? anomalies : ['No anomalies detected'],
  };
};

const GeminiAnalyzer: React.FC = () => {
  const { messages, isConnected } = useWebSocketContext();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [autoAnalyze, setAutoAnalyze] = useState(false);

  const runAnalysis = async () => {
    if (messages.length === 0) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzeWithGemini(messages);
      setAnalyses((prev) => [result, ...prev].slice(0, 5)); // Keep last 5 analyses
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoAnalyze && isConnected && messages.length > 0) {
      interval = setInterval(() => {
        runAnalysis();
      }, 10000); // Analyze every 10 seconds
    }
    return () => clearInterval(interval);
  }, [autoAnalyze, isConnected, messages]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          🤖 Gemini AI Analyzer
          {autoAnalyze && <Badge variant="outline">Auto-analyzing</Badge>}
        </CardTitle>
        <CardDescription>
          AI-powered real-time data analysis and anomaly detection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={runAnalysis} disabled={isAnalyzing || messages.length === 0}>
            {isAnalyzing ? 'Analyzing...' : 'Analyze Now'}
          </Button>
          <Button
            variant={autoAnalyze ? 'default' : 'outline'}
            onClick={() => setAutoAnalyze(!autoAnalyze)}
            disabled={!isConnected}
          >
            {autoAnalyze ? 'Stop Auto-Analyze' : 'Enable Auto-Analyze'}
          </Button>
        </div>

        <ScrollArea className="h-64 w-full rounded-md border p-4">
          {analyses.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No analysis yet. Click "Analyze Now" to start.
            </div>
          ) : (
            <div className="space-y-4">
              {analyses.map((analysis) => (
                <div key={analysis.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-sm">Analysis Report</h4>
                    <span className="text-xs text-muted-foreground">
                      {new Date(analysis.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm">{analysis.summary}</p>
                  
                  <div>
                    <h5 className="text-xs font-semibold mb-1">💡 Insights:</h5>
                    <ul className="text-xs space-y-1">
                      {analysis.insights.map((insight, idx) => (
                        <li key={idx} className="text-muted-foreground">• {insight}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="text-xs font-semibold mb-1">⚠️ Anomalies:</h5>
                    <ul className="text-xs space-y-1">
                      {analysis.anomalies.map((anomaly, idx) => (
                        <li key={idx} className={anomaly === 'No anomalies detected' ? 'text-green-600' : 'text-orange-600'}>
                          • {anomaly}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default GeminiAnalyzer;
