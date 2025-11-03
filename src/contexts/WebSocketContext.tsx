"use client";
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

interface WebSocketMessage {
  id: string;
  timestamp: number;
  type: 'sent' | 'received';
  data: string;
}

interface WebSocketContextType {
  isConnected: boolean;
  messages: WebSocketMessage[];
  latency: number | null;
  connectionUrl: string;
  setConnectionUrl: (url: string) => void;
  connect: (url: string) => void;
  disconnect: () => void;
  sendMessage: (message: string) => boolean;
  clearMessages: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [connectionUrl, setConnectionUrl] = useState('');
  const [latency, setLatency] = useState<number | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastPingRef = useRef<number>(0);

  const addMessage = useCallback((data: string, type: 'sent' | 'received') => {
    const message: WebSocketMessage = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      type,
      data,
    };
    setMessages((prev) => [...prev, message]);
  }, []);

  const connect = useCallback((url: string) => {
    if (!url) {
      console.error('No URL provided');
      return;
    }

    // Close existing connection
    if (wsRef.current) {
      wsRef.current.close();
    }

    // Clear previous ping interval
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
    }

    console.log('Connecting to:', url);

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setConnectionUrl(url);
        addMessage('✅ Connected to WebSocket server', 'received');
        
        // Start ping/pong for latency monitoring
        pingIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            lastPingRef.current = Date.now();
            const pingMessage = JSON.stringify({ type: 'ping', timestamp: lastPingRef.current });
            ws.send(pingMessage);
          }
        }, 5000);
      };

      ws.onmessage = (event) => {
        const data = event.data;
        addMessage(data, 'received');

        // Handle pong for latency calculation
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === 'pong' && parsed.timestamp) {
            const rtt = Date.now() - parsed.timestamp;
            setLatency(rtt);
            console.log('Latency:', rtt, 'ms');
          }
        } catch (e) {
          // Not a JSON message or no pong, that's okay
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        addMessage('❌ WebSocket error occurred', 'received');
      };

      ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        setIsConnected(false);
        addMessage(`🔴 Disconnected from WebSocket server (${event.code})`, 'received');
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }
        setLatency(null);
      };
    } catch (error) {
      console.error('Failed to connect:', error);
      addMessage(`❌ Failed to connect: ${error instanceof Error ? error.message : 'Unknown error'}`, 'received');
    }
  }, [addMessage]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      console.log('Manually disconnecting...');
      wsRef.current.close(1000, 'Client disconnect');
      wsRef.current = null;
    }
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
    setIsConnected(false);
    setLatency(null);
  }, []);

  const sendMessage = useCallback((message: string): boolean => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(message);
        addMessage(message, 'sent');
        return true;
      } catch (error) {
        console.error('Failed to send message:', error);
        addMessage(`❌ Failed to send: ${error instanceof Error ? error.message : 'Unknown error'}`, 'received');
        return false;
      }
    } else {
      console.warn('Cannot send message: WebSocket is not connected');
      return false;
    }
  }, [addMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  useEffect(() => {
    return () => {
      console.log('Cleaning up WebSocket...');
      disconnect();
    };
  }, [disconnect]);

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        messages,
        latency,
        connectionUrl,
        setConnectionUrl,
        connect,
        disconnect,
        sendMessage,
        clearMessages,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within WebSocketProvider');
  }
  return context;
};
