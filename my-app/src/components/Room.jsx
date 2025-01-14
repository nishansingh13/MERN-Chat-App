import React, { useCallback, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useLocation, useNavigate } from "react-router-dom";
import { useSocket } from "@/Context/SocketProvider";
import peer from "../service/peer";
import { Loader2, PhoneOffIcon } from "lucide-react";

function Room() {
  const { state } = useLocation();
  const { email, id } = state || {};
  const socketRef = useSocket();
  const [loading ,setLoading] = useState(false);
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
  }, [remoteSocketId, remoteStream]);
  const handleStopCall = () => {
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
      socketRef.current.on("stop the call", handleStopCall);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("user joined", handleUserJoined);
        socketRef.current.off("incoming call", handleIncomingCall);
        socketRef.current.off("call accepted", handleCallAccepted);
        socketRef.current.off("nego needed", handleNegoIncoming);
        socketRef.current.off("peer nego final", handleNegoFinal);
        socketRef.current.off("stop the call", handleStopCall);
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
 const afterTimeout = () => {
  // setLoading(false);
  console.log("Additional action executed after timeout.");
  handleCallUser();
};

useEffect(()=>{
  setTimeout(afterTimeout, 5000);
  console.log("done");
},[])

  const back = () => {
    navigate("/chats");
    socketRef.current.emit("stop call");
    // window.location.reload();
  }

  return (
    <>

      <div className="w-full h-screen bg-[#F7E9D2]">
        {(remoteStream && myStream)?(
          <div>
            <button onClick={handleCallUser}>Click here if video didnt worked</button>

        <div className="flex mx-[1rem]">
          {remoteStream && (
          

            <div className="w-[60%] relative top-4">
                <div className="text-[2rem]  w-[80%] py-4">User Video</div>
              <div className="w-[80%] h-auto  rounded-2xl overflow-hidden my-2"
                
              >
                
                <ReactPlayer
                
                  width="100%"
                  height="100%"
                  playing
                  
                  url={remoteStream}
                />
              </div>

              <div className="flex items-center justify-center  w-[80%]"> <button onClick={back} className="p-2 rounded-full bg-red-400 z-10"><PhoneOffIcon /></button></div>


            </div>
          )}
          {myStream && (
            
            <div>

            <div className="w-[10rem] relative top-[30rem]  overflow-hidden rounded-xl bg-black ">
              
              <ReactPlayer playing muted width="100%" height="100%" url={myStream} />
            </div>

            </div>
          )}
        </div>
        </div>
        ):(<div className="bg-black h-full flex justify-center items-center text-orange-500 text-[1.5rem]">Please wait <Loader2 className="animate-spin relative p-1"/></div>)}
      </div>

    </>
  );
}

export default Room;
