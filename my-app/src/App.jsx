import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import User from './components/Userdata';
import UserData from './components/Userdata';
function App() {
  

  return (
  
      <Routes>
        <Route 
        path='/'
        element = {<UserData/>}
        />
      </Routes>
    
  );
}

export default App;