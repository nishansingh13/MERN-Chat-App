import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import User from './components/Userdata';
import Login from './components/Login';
import UserData from './components/Userdata';
import ChatPage from './Pages/ChatPage';
import HomePage from './Pages/HomePage';
function App() {
  

  return (
  
      <Routes>
        <Route 
        path='/'
        element = {<Login/>}
        />
        <Route 
        path='/chats'
        element = {
          <ChatPage/>
        }/>
        <Route 
        path='homepage'
        element = {<HomePage/>}
        />
      </Routes>
    
  );
}

export default App;