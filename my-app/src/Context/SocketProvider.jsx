import React, { createContext, useContext, useRef, useEffect } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const socketRef = useRef(null);

    useEffect(() => {
        const endpoint = "http://192.168.1.11:5000";
        socketRef.current = io(endpoint);

        return () => {
            socketRef.current.disconnect(); 
        };
    }, []);

    return (
        <SocketContext.Provider value={socketRef}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    return useContext(SocketContext);
};