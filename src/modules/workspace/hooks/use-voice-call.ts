"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";

export type CallType = "audio" | "video";

interface CallUser {
  id: string;
  name: string;
  image?: string;
  offer?: RTCSessionDescriptionInit;
  callType?: CallType;
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
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callType, setCallType] = useState<CallType>("audio");
  const [callParticipants, setCallParticipants] = useState<CallUser[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
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
      console.log("Received remote track:", event.track.kind);
      remoteStreamRef.current = event.streams[0];
      
      // Play remote audio
      const audioElement = document.getElementById(
        "remote-audio"
      ) as HTMLAudioElement;
      if (audioElement) {
        audioElement.srcObject = event.streams[0];
        audioElement.play().catch(err => {
          // Ignore AbortError as it's expected when stream changes
          if (err.name !== 'AbortError') {
            console.error("Error playing remote audio:", err);
          }
        });
      }

      // Play remote video if available
      if (event.streams[0].getVideoTracks().length > 0) {
        setTimeout(async () => {
          const videoElement = document.getElementById(
            "remote-video"
          ) as HTMLVideoElement;
          if (videoElement) {
            try {
              // Only set srcObject if it's different to avoid interruptions
              if (videoElement.srcObject !== event.streams[0]) {
                videoElement.srcObject = event.streams[0];
              }
              // Wait for the video to be ready before playing
              if (videoElement.paused) {
                await videoElement.play();
              }
              console.log("Remote video stream set successfully");
            } catch (err: any) {
              // Ignore AbortError as it's expected when stream changes
              if (err.name !== 'AbortError') {
                console.error("Error playing remote video:", err);
              }
            }
          }
        }, 200);
      }
    };

    // Handle connection state
    pc.onconnectionstatechange = () => {
      console.log("WebRTC Connection state:", pc.connectionState);
      console.log("ICE Connection state:", pc.iceConnectionState);
      console.log("Signaling state:", pc.signalingState);
      
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
    async (targetUser: CallUser, type: CallType = "audio") => {
      try {
        setIsConnecting(true);
        setCallType(type);

        // Get local media stream
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: type === "video" ? {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user"
          } : false,
        });
        localStreamRef.current = stream;

        console.log("Local stream obtained:", {
          audio: stream.getAudioTracks().length,
          video: stream.getVideoTracks().length
        });

        // Show local video if video call
        if (type === "video") {
          setIsVideoEnabled(true);
          // Use setTimeout to ensure video element is rendered
          setTimeout(async () => {
            const localVideoElement = document.getElementById(
              "local-video"
            ) as HTMLVideoElement;
            if (localVideoElement && stream) {
              try {
                localVideoElement.srcObject = stream;
                // Wait for the video to be ready before playing
                await localVideoElement.play();
                console.log("Local video element initialized successfully");
              } catch (err: any) {
                // Ignore AbortError as it's expected when stream changes
                if (err.name !== 'AbortError') {
                  console.error("Error playing local video:", err);
                }
              }
            } else {
              console.error("Local video element not found!");
            }
          }, 300);
        }

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
          callType: type,
          workspaceId,
        });

        setCallParticipants([targetUser]);
        const callIcon = type === "video" ? "📹" : "📞";
        toast.info(`${callIcon} Calling ${targetUser.name}...`);
      } catch (error) {
        console.error("Failed to start call:", error);
        toast.error("Failed to start call. Please check microphone/camera permissions.");
        setIsConnecting(false);
        
        // Clean up if failed
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach((track) => track.stop());
          localStreamRef.current = null;
        }
      }
    },
    [initializePeerConnection, broadcastSignal, workspaceId, currentUserId, currentUserName]
  );

  // Cancel outgoing call
  const cancelCall = useCallback(() => {
    if (!isConnecting) return;

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

    // Clear video elements
    const localVideo = document.getElementById("local-video") as HTMLVideoElement;
    if (localVideo) localVideo.srcObject = null;

    // Broadcast call cancelled
    const targetUserId = callParticipants[0]?.id;
    if (targetUserId) {
      broadcastSignal("call_signal", {
        type: "call-cancelled",
        userId: currentUserId,
        targetUserId,
        workspaceId,
      });
    }

    setIsConnecting(false);
    setCallParticipants([]);
    setIsMuted(false);
    setIsVideoEnabled(false);
    setCallType("audio");
    pendingIceCandidatesRef.current = [];

    toast.info("📞 Call cancelled");
  }, [isConnecting, callParticipants, broadcastSignal, workspaceId, currentUserId]);

  // Answer a call
  const answerCall = useCallback(
    async (offer: RTCSessionDescriptionInit, caller: CallUser) => {
      try {
        setIsConnecting(true);
        const type = caller.callType || "audio";
        setCallType(type);

        // Get local media stream
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: type === "video" ? {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user"
          } : false,
        });
        localStreamRef.current = stream;

        console.log("Local stream obtained (answer):", {
          audio: stream.getAudioTracks().length,
          video: stream.getVideoTracks().length
        });

        // Show local video if video call
        if (type === "video") {
          setIsVideoEnabled(true);
          // Use setTimeout to ensure video element is rendered
          setTimeout(async () => {
            const localVideoElement = document.getElementById(
              "local-video"
            ) as HTMLVideoElement;
            if (localVideoElement && stream) {
              try {
                localVideoElement.srcObject = stream;
                // Wait for the video to be ready before playing
                await localVideoElement.play();
                console.log("Local video element initialized successfully (answer)");
              } catch (err: any) {
                // Ignore AbortError as it's expected when stream changes
                if (err.name !== 'AbortError') {
                  console.error("Error playing local video:", err);
                }
              }
            } else {
              console.error("Local video element not found!");
            }
          }, 300);
        }

        // Initialize peer connection
        const pc = initializePeerConnection();

        // Add local tracks
        stream.getTracks().forEach((track) => {
          console.log("Adding local track to peer connection:", track.kind);
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
                  callType: signal.callType || "audio",
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

          case "call-cancelled":
            // Handle incoming call being cancelled by caller
            if (signal.targetUserId === currentUserId && (isConnecting || !isInCall)) {
              toast.info("📞 Call was cancelled");
              // If we have an incoming call modal, it will be handled by the component
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
    
    // Stop screen sharing if active
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }
    
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

    // Clear video elements
    const localVideo = document.getElementById("local-video") as HTMLVideoElement;
    const remoteVideo = document.getElementById("remote-video") as HTMLVideoElement;
    if (localVideo) localVideo.srcObject = null;
    if (remoteVideo) remoteVideo.srcObject = null;

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
    setIsVideoEnabled(false);
    setIsScreenSharing(false);
    setCallType("audio");

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

  // Toggle video
  const toggleVideo = useCallback(async () => {
    if (!localStreamRef.current || callType !== "video") return;

    try {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        const newVideoState = videoTrack.enabled;
        setIsVideoEnabled(newVideoState);
        
        if (newVideoState) {
          toast.success("📹 Camera enabled");
        } else {
          toast.info("📷 Camera disabled");
        }
      }
    } catch (error) {
      console.error("Failed to toggle video:", error);
      toast.error("Failed to toggle camera");
    }
  }, [callType]);

  // Start screen sharing
  const startScreenShare = useCallback(async () => {
    if (!peerConnectionRef.current || !isInCall) return;

    try {
      // Get screen stream
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: "always",
        } as MediaTrackConstraints,
        audio: false,
      });

      screenStreamRef.current = screenStream;
      
      // Replace video track with screen track
      const screenTrack = screenStream.getVideoTracks()[0];
      const pc = peerConnectionRef.current;
      const senders = pc.getSenders();
      const videoSender = senders.find((sender) => 
        sender.track?.kind === "video"
      );

      if (videoSender) {
        await videoSender.replaceTrack(screenTrack);
      } else {
        pc.addTrack(screenTrack, screenStream);
      }

      // Update local video element
      const localVideoElement = document.getElementById(
        "local-video"
      ) as HTMLVideoElement;
      if (localVideoElement) {
        localVideoElement.srcObject = screenStream;
      }

      setIsScreenSharing(true);
      toast.success("🖥️ Screen sharing started");

      // Listen for when user stops sharing
      screenTrack.onended = () => {
        stopScreenShare();
      };
    } catch (error) {
      console.error("Failed to start screen sharing:", error);
      toast.error("Failed to start screen sharing");
    }
  }, [isInCall]);

  // Stop screen sharing
  const stopScreenShare = useCallback(async () => {
    if (!screenStreamRef.current || !peerConnectionRef.current) return;

    try {
      // Stop screen stream
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;

      // Switch back to camera if video was enabled
      if (localStreamRef.current && callType === "video") {
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        const cameraTrack = cameraStream.getVideoTracks()[0];
        const pc = peerConnectionRef.current;
        const senders = pc.getSenders();
        const videoSender = senders.find((sender) => 
          sender.track?.kind === "video"
        );

        if (videoSender) {
          await videoSender.replaceTrack(cameraTrack);
        }

        // Update local video stream
        const oldVideoTrack = localStreamRef.current.getVideoTracks()[0];
        if (oldVideoTrack) {
          localStreamRef.current.removeTrack(oldVideoTrack);
        }
        localStreamRef.current.addTrack(cameraTrack);

        // Update local video element
        const localVideoElement = document.getElementById(
          "local-video"
        ) as HTMLVideoElement;
        if (localVideoElement) {
          localVideoElement.srcObject = localStreamRef.current;
        }
      }

      setIsScreenSharing(false);
      toast.info("🖥️ Screen sharing stopped");
    } catch (error) {
      console.error("Failed to stop screen sharing:", error);
      toast.error("Failed to stop screen sharing");
    }
  }, [callType]);

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
    isVideoEnabled,
    isScreenSharing,
    isConnecting,
    callType,
    callParticipants,
    startCall,
    answerCall,
    endCall,
    cancelCall,
    toggleMute,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
    handleCallSignal,
  };
}
