"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";

interface CallUser {
  id: string;
  name: string;
  image?: string;
  offer?: RTCSessionDescriptionInit;
}

interface UseVoiceCallProps {
  workspaceId: string;
  currentUserId: string;
  currentUserName?: string;
  onIncomingCall?: (caller: CallUser) => void;
  broadcastSignal: (type: string, data: any) => void;
}

export function useVoiceCall({
  workspaceId,
  currentUserId,
  currentUserName,
  onIncomingCall,
  broadcastSignal,
}: UseVoiceCallProps) {
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callParticipants, setCallParticipants] = useState<CallUser[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const pendingIceCandidatesRef = useRef<RTCIceCandidateInit[]>([]);

  // Initialize WebRTC
  const initializePeerConnection = useCallback(() => {
    const configuration: RTCConfiguration = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    };

    const pc = new RTCPeerConnection(configuration);

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        broadcastSignal("call_signal", {
          type: "ice-candidate",
          candidate: event.candidate,
          workspaceId,
        });
      }
    };

    // Handle incoming stream
    pc.ontrack = (event) => {
      remoteStreamRef.current = event.streams[0];
      // Play remote audio
      const audioElement = document.getElementById(
        "remote-audio"
      ) as HTMLAudioElement;
      if (audioElement) {
        audioElement.srcObject = event.streams[0];
      }
    };

    // Handle connection state
    pc.onconnectionstatechange = () => {
      console.log("Connection state:", pc.connectionState);
      if (pc.connectionState === "connected") {
        setIsConnecting(false);
        setIsInCall(true);
        toast.success("✅ Call connected successfully!");
      } else if (pc.connectionState === "connecting") {
        toast.info("🔄 Connecting...");
      } else if (pc.connectionState === "disconnected") {
        toast.warning("⚠️ Call disconnected");
        endCall();
      } else if (pc.connectionState === "failed") {
        toast.error("❌ Call connection failed");
        endCall();
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  }, [broadcastSignal, workspaceId]);

  // Start a call
  const startCall = useCallback(
    async (targetUser: CallUser) => {
      try {
        setIsConnecting(true);

        // Get local audio stream
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        localStreamRef.current = stream;

        // Initialize peer connection
        const pc = initializePeerConnection();

        // Add local tracks to peer connection
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });

        // Create and send offer
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        // Broadcast offer to target user
        broadcastSignal("call_signal", {
          type: "offer",
          offer,
          userId: currentUserId,
          targetUserId: targetUser.id,
          callerName: currentUserName || "Unknown User",
          workspaceId,
        });

        setCallParticipants([targetUser]);
        toast.info(`📞 Calling ${targetUser.name}...`);
      } catch (error) {
        console.error("Failed to start call:", error);
        toast.error("Failed to start call. Please check microphone permissions.");
        setIsConnecting(false);
      }
    },
    [initializePeerConnection, broadcastSignal, workspaceId]
  );

  // Answer a call
  const answerCall = useCallback(
    async (offer: RTCSessionDescriptionInit, caller: CallUser) => {
      try {
        setIsConnecting(true);

        // Get local audio stream
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        localStreamRef.current = stream;

        // Initialize peer connection
        const pc = initializePeerConnection();

        // Add local tracks
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });

        // Set remote description
        await pc.setRemoteDescription(offer);

        // Add any pending ICE candidates after remote description is set
        if (pendingIceCandidatesRef.current.length > 0) {
          console.log(`Adding ${pendingIceCandidatesRef.current.length} pending ICE candidates`);
          for (const candidate of pendingIceCandidatesRef.current) {
            try {
              await pc.addIceCandidate(candidate);
            } catch (err) {
              console.error("Error adding pending ICE candidate:", err);
            }
          }
          pendingIceCandidatesRef.current = [];
        }

        // Create and send answer
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        // Broadcast answer
        broadcastSignal("call_signal", {
          type: "answer",
          answer,
          targetUserId: caller.id,
          workspaceId,
        });

        setCallParticipants([caller]);
        toast.success(`📞 Answering call from ${caller.name}...`);
      } catch (error) {
        console.error("Failed to answer call:", error);
        toast.error("❌ Failed to answer call. Please check microphone permissions.");
        setIsConnecting(false);
      }
    },
    [initializePeerConnection, broadcastSignal, workspaceId]
  );

  // Handle incoming call signals
  const handleCallSignal = useCallback(
    async (signal: any) => {
      try {
        const pc = peerConnectionRef.current;

        switch (signal.type) {
          case "offer":
            // Check if the offer is for this user
            if (signal.targetUserId === currentUserId) {
              // Incoming call notification
              if (onIncomingCall) {
                onIncomingCall({
                  id: signal.userId || "unknown",
                  name: signal.callerName || "Unknown",
                  image: signal.callerImage,
                  offer: signal.offer,
                });
              }
            }
            break;

          case "answer":
            if (pc && signal.targetUserId === currentUserId) {
              await pc.setRemoteDescription(signal.answer);
              
              // Add any pending ICE candidates after remote description is set
              if (pendingIceCandidatesRef.current.length > 0) {
                console.log(`Adding ${pendingIceCandidatesRef.current.length} pending ICE candidates`);
                for (const candidate of pendingIceCandidatesRef.current) {
                  try {
                    await pc.addIceCandidate(candidate);
                  } catch (err) {
                    console.error("Error adding pending ICE candidate:", err);
                  }
                }
                pendingIceCandidatesRef.current = [];
              }
            }
            break;

          case "ice-candidate":
            if (signal.candidate) {
              if (pc && pc.remoteDescription) {
                // Remote description is set, add candidate immediately
                try {
                  await pc.addIceCandidate(signal.candidate);
                } catch (err) {
                  console.error("Error adding ICE candidate:", err);
                }
              } else {
                // Remote description not set yet, buffer the candidate
                console.log("Buffering ICE candidate until remote description is set");
                pendingIceCandidatesRef.current.push(signal.candidate);
              }
            }
            break;

          case "call-ended":
            if (isInCall || isConnecting) {
              toast.info("📞 The other person ended the call");
              endCall();
            }
            break;
        }
      } catch (error) {
        console.error("Error handling call signal:", error);
        // Don't show toast for ICE candidate errors as they're handled above
        if (signal.type !== "ice-candidate") {
          toast.error("❌ Error processing call signal");
        }
      }
    },
    [currentUserId, onIncomingCall, isInCall, isConnecting]
  );

  // End call
  const endCall = useCallback(() => {
    const wasInCall = isInCall || isConnecting;
    
    // Clear pending ICE candidates
    pendingIceCandidatesRef.current = [];
    
    // Stop local tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Broadcast call ended
    if (wasInCall) {
      broadcastSignal("call_signal", {
        type: "call-ended",
        workspaceId,
      });
    }

    setIsInCall(false);
    setIsConnecting(false);
    setCallParticipants([]);
    setIsMuted(false);

    if (wasInCall) {
      toast.info("📞 Call ended");
    }
  }, [broadcastSignal, workspaceId, isInCall, isConnecting]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        const newMutedState = !audioTrack.enabled;
        setIsMuted(newMutedState);
        
        if (newMutedState) {
          toast.info("🔇 Microphone muted");
        } else {
          toast.success("🎤 Microphone unmuted");
        }
      }
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isInCall) {
        endCall();
      }
    };
  }, [isInCall, endCall]);

  return {
    isInCall,
    isMuted,
    isConnecting,
    callParticipants,
    startCall,
    answerCall,
    endCall,
    toggleMute,
    handleCallSignal,
  };
}
