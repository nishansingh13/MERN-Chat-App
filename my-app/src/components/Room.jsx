import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../service/peer";
import { useLocation } from "react-router-dom";
import { ChatState } from "@/Context/ChatProvider";
import { io } from "socket.io-client";
import { useSocket } from "@/Context/SocketProvider";

function Room() {
  const { state } = useLocation();
  const { email, id } = state || {};
  const socketRef=useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  // User joined room logic
  useEffect(() => {
    // console.log(socketRef.current.connected);
    // console.log(socketRef.current);
    if(socketRef.current){
      console.log("aagya",socketRef.current);
    }
    else{
      console.log("whtt");
    }
    if (email && id) {
      console.log(`User joined with ${email} and socket id ${id}`);
      setRemoteSocketId(id); // Now that we have the ID, set the remoteSocketId
    }
  }, [email, id]);

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    if (!remoteSocketId) return; // Avoid making a call if remoteSocketId is not set

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socketRef.current.emit("user call", { to: remoteSocketId, offer});
    setMyStream(stream);
  }, [remoteSocketId, socketRef]);

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log("Incoming call from", from);
      const ans = await peer.getAnswer(offer);
      socketRef.current.emit("call accepted", { to: from, ans });
    },
    [socketRef]
  );

  const sendStreams = useCallback(() => {
    const senders = peer.peer.getSenders();
    myStream.getTracks().forEach((track) => {
      const sender = senders.find((s) => s.track?.kind === track.kind);
      if (!sender) {
        peer.peer.addTrack(track, myStream);
      }
    });
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socketRef.current.emit("nego needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socketRef]);

  useEffect(() => {
    peer.peer.addEventListener("negotiation_needed", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiation_needed", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoIncoming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socketRef.current.emit("peer nego done", { to: from, ans });
    },
    [socketRef]
  );

  const handleNegoFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", (ev) => {
      const remoteStream = ev.streams[0];
      console.log("Remote stream received");
      setRemoteStream(remoteStream);
    });
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("user joined", handleUserJoined);
      socketRef.current.on("incoming call", handleIncomingCall);
      socketRef.current.on("call accepted", handleCallAccepted);
      socketRef.current.on("nego needed", handleNegoIncoming);
      socketRef.current.on("peer nego final", handleNegoFinal);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("user joined", handleUserJoined);
        socketRef.current.off("incoming call", handleIncomingCall);
        socketRef.current.off("call accepted", handleCallAccepted);
        socketRef.current.off("nego needed", handleNegoIncoming);
        socketRef.current.off("peer nego final", handleNegoFinal);
      }
    };
  }, [
    socketRef,
    handleUserJoined,
    handleIncomingCall,
    handleCallAccepted,
    handleNegoIncoming,
    handleNegoFinal,
  ]);

  return (
    <>
      <div>Room Page</div>
      <div>{remoteSocketId ? "Connected" : "No one in room"}</div>
      <br />
      {remoteSocketId && (
        <button
          className="bg-black p-1 px-2 text-white rounded-md m-2"
          onClick={handleCallUser}
          disabled={!remoteSocketId} // Disable until remoteSocketId is set
        >
          Call
        </button>
      )}
      {myStream && (
        <div>
          <h3>My Stream</h3>
          <ReactPlayer
            playing
            muted
            height="100px"
            width="200px"
            url={myStream}
            playsinline
          />
        </div>
      )}
      {remoteStream && (
        <div>
          <h3>Remote Stream</h3>
          <ReactPlayer
            playing
            muted
            height="100px"
            width="200px"
            url={remoteStream}
            playsinline
          />
        </div>
      )
      }
    </>
  );
}

export default Room;
