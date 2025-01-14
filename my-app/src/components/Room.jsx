import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSocket } from "@/Context/SocketProvider";
import peer from "../service/peer";
import { PhoneOffIcon } from "lucide-react";

function Room() {
  const { state } = useLocation();
  const { email, id } = state || {};
  const socketRef = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setMyStream(stream);
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
        }
        stream.getTracks().forEach((track) => peer.peer.addTrack(track, stream));
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    initializeStream();
  }, []);

  const handleUserJoined = useCallback(({ id }) => {
    setRemoteSocketId(id);
  }, []);

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const answer = await peer.getAnswer(offer);
      socketRef.current.emit("call accepted", { to: from, answer });
    },
    [socketRef]
  );

  const handleCallAccepted = useCallback(
    async ({ answer }) => {
      await peer.setLocalDescription(answer);
    },
    []
  );

  const handleNegotiationNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socketRef.current.emit("call user", { to: remoteSocketId, offer });
  }, [remoteSocketId, socketRef]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegotiationNeeded);

    peer.peer.addEventListener("track", (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setRemoteStream(event.streams[0]);
      }
    });

    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegotiationNeeded);
    };
  }, [handleNegotiationNeeded]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("user joined", handleUserJoined);
      socketRef.current.on("incoming call", handleIncomingCall);
      socketRef.current.on("call accepted", handleCallAccepted);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("user joined", handleUserJoined);
        socketRef.current.off("incoming call", handleIncomingCall);
        socketRef.current.off("call accepted", handleCallAccepted);
      }
    };
  }, [socketRef, handleUserJoined, handleIncomingCall, handleCallAccepted]);

  const handleStopCall = () => {
    navigate("/chats");
    window.location.reload();
  };

  return (
    <div className="w-full h-screen bg-[#F7E9D2] flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        {remoteStream && (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-[60%] rounded-lg"
          />
        )}
        {myStream && (
          <video
            ref={myVideoRef}
            autoPlay
            muted
            playsInline
            className="w-[20%] rounded-lg"
          />
        )}
        <button
          onClick={handleStopCall}
          className="p-2 rounded-full bg-red-400 flex items-center justify-center"
        >
          <PhoneOffIcon />
        </button>
      </div>
    </div>
  );
}

export default Room;
