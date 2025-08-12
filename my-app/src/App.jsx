
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
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