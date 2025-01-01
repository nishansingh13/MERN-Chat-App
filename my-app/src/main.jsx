
import { createRoot } from 'react-dom/client';
import './index.css';
import '../src/index.css';
import App from './App.jsx';
import { BrowserRouter as Router } from 'react-router-dom';
import ChatProvider from './Context/ChatProvider';
import { Toaster } from "@/components/ui/toaster";  // Import the Toaster component



createRoot(document.getElementById('root')).render(
 
    <Router>
      <ChatProvider>
    
        <App />
        <Toaster /> 
        
      </ChatProvider>
    </Router>
 
);
