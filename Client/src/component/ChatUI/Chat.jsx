import React, { useEffect, useState } from 'react'
import './Chat.css'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useRef } from 'react';

const Item = ({ message, bot }) => {
    return (
      <div className={bot ? "aling bot-message" : "aling user-message"}>
        {bot && <div className='circle bot-bg'></div>}
        <div className='msg'>{message}</div>
        {!bot && <div className='circle user-bg'></div>}

      </div>
    );
  };

const Chat = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [messages,setMessages] = useState([{message:"Hi Ashish Let's Start",bot:true}]);
    const [message,setMessage] = useState();

    const endOfMessagesRef = useRef(null);

    useEffect(() => {
      // Scroll to the bottom of the messages container whenever messages change
      endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [message,messages]);

    const submitMessage = async () => {
      try {
        if(message === "") return;

        const data = { message: message, bot: false };
    
        const newMessages = [...messages, data];
        setMessages(newMessages);
    
        setMessage("");
        
        // const response =  await axios.post("http://localhost:8000/api/query",{id,query : message});

        // test Purpose 
        setTimeout(async () => {
          const response = { data: { result: "Great Ashish" } };
          const botdata = { message: response.data.result, bot: true };
      
          const updatedMessages = [...newMessages, botdata];
          setMessages(updatedMessages);
      
          localStorage.setItem("messages", JSON.stringify(updatedMessages));
        }, 2000); // 2-second delay
      } catch (error) {
        console.log(error);
      }
    };

    const endChat = ()=>{
      try {
        localStorage.removeItem('messages');
        navigate("/");
      } catch (error) {
        
      }
    }
    

    useEffect(() => {
        if(id === undefined){
            navigate("/")
        }
        const data = localStorage.getItem("messages");
        if(data){
            setMessages(JSON.parse(data));
        }

    },[id])

  return (
    <div className='chat-container'>
        <div className="chat-box">
            <div className="chat-header">
                Chatting with ChatGPT
                <button className='chat-button'onClick={endChat}>End Chat</button>
            </div>
              <div className="chat-message">
                  {messages.map((data, index) => (
                      <Item key={index} message={data.message} bot={data.bot} />
                  ))}
                  <div ref={endOfMessagesRef} />
                  
              </div>
            <div className="chat-footer">
                <input className="input-chat" type="text" value={message} placeholder="Type your Question here..."
                onChange={e=>setMessage(e.target.value)}/>
                <button className='chat-button' onClick={submitMessage}>Send</button>
            </div>
        </div>
        
    </div>
  )
}

export default Chat