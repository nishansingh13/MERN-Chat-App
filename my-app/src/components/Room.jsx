import React, { useCallback, useEffect, useState } from "react";
import ReactPlayer from "react-player";
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
  const [calling, setCalling] = useState(false); // Track ongoing calls
  const navigate = useNavigate();
  // User joined room logic
  useEffect(() => {
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
    if (!remoteSocketId || calling) return; // Prevent multiple calls
    setCalling(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      const offer = await peer.getOffer();
      socketRef.current.emit("user call", { to: remoteSocketId, offer });
    } catch (error) {
      console.error("Error during call initiation:", error);
    } finally {
      setCalling(false);
    }
  }, [remoteSocketId, socketRef, calling]);

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setMyStream(stream);
        console.log("Incoming call from", from);
        const ans = await peer.getAnswer(offer);
        socketRef.current.emit("call accepted", { to: from, ans });
      } catch (error) {
        console.error("Error handling incoming call:", error);
      }
    },
    [socketRef]
  );

  const sendStreams = useCallback(() => {
    if (!myStream) return;

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
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
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
    handleCallUser();
  }, [remoteSocketId,remoteStream]);
  const handleStopCall = ()=>{
    navigate("/chats");
    window.location.reload();
  }
  
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("user joined", handleUserJoined);
      socketRef.current.on("incoming call", handleIncomingCall);
      socketRef.current.on("call accepted", handleCallAccepted);
      socketRef.current.on("nego needed", handleNegoIncoming);
      socketRef.current.on("peer nego final", handleNegoFinal);
      socketRef.current.on("stop the call",handleStopCall);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("user joined", handleUserJoined);
        socketRef.current.off("incoming call", handleIncomingCall);
        socketRef.current.off("call accepted", handleCallAccepted);
        socketRef.current.off("nego needed", handleNegoIncoming);
        socketRef.current.off("peer nego final", handleNegoFinal);
        socketRef.current.off("stop the call",handleStopCall);
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
  const back = ()=>{
      // navigate("/chats");
      socketRef.current.emit("stop call");
      // window.location.reload();
  }

  return (
    <>
     <button onClick={back} className="border relative top-[43.5rem] left-[55rem] p-2 rounded-full bg-red-400 z-10"><PhoneOffIcon/></button>
     
      <div className=" flex items-center justify-center">
  

     
      {remoteStream && (
          <div className="w-[60%] relative top-4 bg-slate-500">
            <ReactPlayer
            width="100%"
            height="auto"
            style={{
              position:"relative",
              bottom:"50px"
            }}
              playing
              muted
              url={remoteStream}
            />
            </div>
     
      )}
          {myStream && (
  <div className="relative w-[20rem] top-[15rem] mx-[2rem]">
    <ReactPlayer playing muted width="100%"  height="auto" url={myStream} />
  </div>
)}
      </div>
    </>
  );
}

export default Room;
