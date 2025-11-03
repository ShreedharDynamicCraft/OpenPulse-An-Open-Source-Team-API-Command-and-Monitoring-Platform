import { useState, useEffect, useCallback, useRef } from 'react';

interface WebSocketMessage {
  id: string;
  timestamp: number;
  type: 'sent' | 'received';
  data: string;
}

export const useWebSocket = (url?: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [connectionUrl, setConnectionUrl] = useState(url || '');
  const [latency, setLatency] = useState<number | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastPingRef = useRef<number>(0);

  const connect = useCallback((customUrl?: string) => {
    const targetUrl = customUrl || connectionUrl;
    if (!targetUrl) return;

    try {
      wsRef.current = new WebSocket(targetUrl);

      wsRef.current.onopen = () => {
        setIsConnected(true);
        addMessage('Connected to WebSocket server', 'received');
        
        // Start ping/pong for latency monitoring
        pingIntervalRef.current = setInterval(() => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            lastPingRef.current = Date.now();
            wsRef.current.send(JSON.stringify({ type: 'ping', timestamp: lastPingRef.current }));
          }
        }, 5000);
      };

      wsRef.current.onmessage = (event) => {
        const data = event.data;
        addMessage(data, 'received');

        // Handle pong for latency calculation
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === 'pong') {
            const rtt = Date.now() - parsed.timestamp;
            setLatency(rtt);
          }
        } catch (e) {
          // Not a JSON message, ignore
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        addMessage('WebSocket error occurred', 'received');
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);
        addMessage('Disconnected from WebSocket server', 'received');
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
        }
      };
    } catch (error) {
      console.error('Failed to connect:', error);
      addMessage('Failed to connect to WebSocket server', 'received');
    }
  }, [connectionUrl]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
    }
  }, []);

  const sendMessage = useCallback((message: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(message);
      addMessage(message, 'sent');
    }
  }, []);

  const addMessage = (data: string, type: 'sent' | 'received') => {
    const message: WebSocketMessage = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      type,
      data,
    };
    setMessages((prev) => [...prev, message]);
  };

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    messages,
    latency,
    connectionUrl,
    setConnectionUrl,
    connect,
    disconnect,
    sendMessage,
    clearMessages,
  };
};
