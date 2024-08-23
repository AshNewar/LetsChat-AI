import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import FileUpload from './component/FileUpload/FileUpload.jsx';
import Chat from './component/ChatUI/Chat.jsx';

function Home() {
  return <h2>Home Page</h2>;
}

function App() {
  return (
    <Router>
      
        <Routes>
          <Route path="/" element={<div className='container'><FileUpload /></div>} />
          <Route path="/chat/:id" element={<Chat />} />
        </Routes>
    </Router>
  );
}

export default App;
