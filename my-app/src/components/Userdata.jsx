import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Userdata() {
  const [userdata, setuserdata] = useState([]);

  const fetchChats = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/chat");
      setuserdata(data);
      console.log(data); // Ensure this logs correctly
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <>
      {userdata.map((chat) => {
        return <div key={chat._id}>{chat.chatName}</div>; // Ensure there's a return statement
      })}
    </>
  );
}

export default Userdata;
