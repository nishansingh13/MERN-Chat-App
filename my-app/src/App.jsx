
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import ChatPage from './Pages/ChatPage';
import HomePage from './Pages/HomePage';
import Room from './components/Room';
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
        <Route
        path='/call'
        element = {<Room/>}
        />
      </Routes>
    
  );
}

export default App;