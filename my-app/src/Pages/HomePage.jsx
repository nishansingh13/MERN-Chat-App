import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Login from "../components/Login";
function HomePage(){
    const navigate = useNavigate();
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));
    
        if (user) navigate("/chats");
      }, [navigate]);
    
    return (
        
        <>
        <Login/>
        
        </>
    )
}
export default HomePage;