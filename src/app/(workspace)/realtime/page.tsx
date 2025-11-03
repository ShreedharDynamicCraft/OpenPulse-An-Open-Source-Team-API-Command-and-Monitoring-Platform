"use client";
import RealtimeConnectionBar from '@/modules/realtime/components/realtime-connection-bar'
import RealtimeMessageEditor from '@/modules/realtime/components/realtime-message-editor'
import RealtimeTester from '@/modules/realtime/components/realtime-tester'
import GeminiAnalyzer from '@/modules/realtime/components/gemini-analyzer'
import LatencyMonitor from '@/modules/realtime/components/latency-monitor'
import RateLimiterTester from '@/modules/realtime/components/rate-limiter-tester'
import AIMassMessenger from '@/modules/realtime/components/ai-mass-messenger'
import RealtimeConnectionManager from '@/modules/realtime/components/realtime-connection-manager'
import { WebSocketProvider } from '@/contexts/WebSocketContext'

import React from 'react'

const page = () => {
  return (
    <WebSocketProvider>
      <div className="flex flex-col h-full">
        <div className='px-6 py-6 space-y-4'>
          <div className="space-y-2">
            <h1 className='text-2xl font-bold'>WebSocket</h1>
            <p className='text-sm text-muted-foreground'>Connect to a websocket server and start testing!</p>
          </div>
          
          {/* New Connection Manager */}
          <RealtimeConnectionManager />
          
          {/* Original Connection Bar (keeping for compatibility) */}
          <RealtimeConnectionBar />
        </div>
        
        <div className="flex-1 overflow-auto flex flex-col px-6 pb-6 space-y-6">
          <RealtimeMessageEditor />
          
          {/* Monitoring Tools */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LatencyMonitor />
            <GeminiAnalyzer />
          </div>
          
          {/* Testing Tools */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RateLimiterTester />
            <AIMassMessenger />
          </div>
          
          <RealtimeTester />
        </div>
      </div>
    </WebSocketProvider>
  )
}

export default page