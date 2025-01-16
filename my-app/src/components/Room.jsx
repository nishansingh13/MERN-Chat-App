import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../service/peer";
import { useLocation, useNavigate } from "react-router-dom";
import { ChatState } from "@/Context/ChatProvider";
import { io } from "socket.io-client";
import { useSocket } from "@/Context/SocketProvider";
import { Loader2 } from "lucide-react";

function Room() {
  const { state } = useLocation();
  const { email, id } = state || {};
  const [check,setCheck]=useState(null);
  const [button,setbutton] = useState(false);
  const socketRef=useSocket();
  const [loading,setLoading]=useState(false);
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const navigate = useNavigate();
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
      console.log("ye kaha aaya h");
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
      console.log("Call Accepted sender side ka msg");
      sendStreams();
      if(!check){
      handleCallUser();
      setCheck("exist");
      }
    },
    [sendStreams]
  );
  // useEffect(()=>{
  //     handleCallUser();
  // },[remoteSocketId])

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
      socketRef.current.on("button htao",()=>{setbutton(true)});
      socketRef.current.on("stop the call",()=>{navigate("/chats");window.location.reload()})
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("user joined", handleUserJoined);
        socketRef.current.off("incoming call", handleIncomingCall);
        socketRef.current.off("call accepted", handleCallAccepted);
        socketRef.current.off("nego needed", handleNegoIncoming);
        socketRef.current.off("peer nego final", handleNegoFinal);
        socketRef.current.off("button htao",()=>{setbutton(true)});
        socketRef.current.off("stop the call",()=>{navigate("/chats");window.location.reload()})

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
      navigate("/chats");
      socketRef.current.emit("stop call");
      window.location.reload();
      }

  return (
    <>
    
      (
        <button
          className="bg-black p-1 px-2 text-white rounded-md m-2"
          onClick={() => { handleCallUser(); socketRef.current.emit("button") }}
          disabled={!remoteSocketId} // Disable until remoteSocketId is set
        >
          Start Call
        </button>
      )
        <button
          className="bg-black p-1 px-2 text-white rounded-md m-2"
          onClick={() =>{back()}}
          disabled={!remoteSocketId} // Disable until remoteSocketId is set
        >
          End Call
        </button>
      <div className="bg-black flex h-screen">
      {remoteStream && (
        <div className="overflow-hidden w-[60%] rounded-md">
          
          <ReactPlayer
            playing
            playsinline
            height="45rem"
            width=""
            url={remoteStream}
            style={{
              transform:'scaleX(-1)'
            }}
          />
        </div>
      
      )}
    
      {myStream && (
        <div className="relative top-[30rem] bg-gray-50 h-[10rem]">
          <h3>My Stream</h3>
          <ReactPlayer
            playing
            muted
            playsinline
            height="100px"
            width="200px"
            url={myStream}
            style={{
              transform:'scaleX(-1)',
              
            }}
          
            
          />
        </div>
      )}
      </div>
      
     
  
    </>
  );
}

export default Room;
