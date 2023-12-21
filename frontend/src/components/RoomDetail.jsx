
// import React, { useState } from 'react';
import '../RoomDetail2.css'; // Your CSS file for styling
import WebPlayback from './WebPlayback';
import io from 'socket.io-client';
import React,{useRef, useState, useEffect, useContext} from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const RoomDetail = () => {
  const [chat, setChat] = useState([{name:'a',message:'hello'}]); // Placeholder for chat messages
  const [newMessage, setNewMessage] = useState('');

  const [playerState, setPlayerState] = useState(undefined)
  const { currentUser } = useContext(AuthContext);
  const [isHost, setIsHost] = useState(false)

  const { roomId } = useParams(); // Retrieve roomId from URL
  console.log('roomid isss')
  console.log(roomId)
  const [roomInfo, setRoomInfo] = useState(undefined); // State to hold room info
  const [isChatVisible, setIsChatVisible] = useState(true);

  const toggleChatVisibility = () => {
    setIsChatVisible(!isChatVisible);
  };


  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io('http://localhost:3000');
    socketRef.current.emit('user_join', currentUser.displayName);
    return () => {
      socketRef.current.disconnect();
    };
  }, []);


  useEffect(() => {
    console.log('use effect fired')
    socketRef.current.on('message', ({name, message}) => {
      console.log('The server has broadcast message data to all clients');
      setChat([...chat, {name, message}]);
      console.log(chat)
    });
    socketRef.current.on('user_join', function (data) {
        
      console.log('The server has broadcast user join event to all clients');
      setChat([
        ...chat,
        {name: 'ChatBot', message: `${data} has joined the chat`}
      ]);
    });

    
    return () => {
      socketRef.current.off('message');
      socketRef.current.off('user_join');
      
    };
  }, [chat]);

  useEffect(() => {
    socketRef.current.on('update_player_state', (state) => {
        // Here, you'd use the Spotify Web Playback SDK to update the player state
        console.log('Received player state update from server:', state);
        setPlayerState(state)
      });

      return () => {
        socketRef.current.off('update_player_state')
      }
  },[playerState])

  useEffect(() => {
    console.log('fetching room info useeffect')
    const fetchRoomInfo = async () => {
        
      try {
        const response = await axios.get(`http://localhost:3000/rooms/${roomId}`);
        const room = response.data;
        console.log('room is::::')
        console.log(room)
        if (room.adminID === currentUser.uid) {
            setIsHost(true)
        } else {
            setIsHost(false)
        }
        setRoomInfo(room);
      } catch (error) {
        console.error('Error fetching room info:', error);
        // Handle error appropriately
        alert('Error fetching room info')
      }
    };

    if (roomId) {
      fetchRoomInfo();
    }
  }, [roomId]);
  

  const handleSend = () => {
    if (newMessage.trim()) {
      const timestamp = new Date().toISOString();
    // setChat([...chat, { name: 'Shreyak', message: newMessage}]);
    socketRef.current.emit('message', {
        name: currentUser.displayName,
        message: newMessage
      });
      setNewMessage(''); // Reset input field
    }
  };

  const handleHostPlayerAction = (message) => {
    // Add your logic here to handle play/pause state change
    console.log(`Play/Pause button pressed`);
    socketRef.current.emit('message', {
      name: 'Chatbot',
      message: message
    });
  };

  if (!roomInfo) {
    return (
        <h1>Getting Room Info</h1>
    )
  } else {
    return (
        <div className="room-detail-container">
          <div className="room-header">
            <h1>Welcome to {roomInfo && roomInfo.title}</h1>
            {isHost ? (
              <div>
                <p>You are the host of this room</p>
              </div>
            ) : (
              <div>
                <p>Welcome! Wait for the host to start the music party</p>
              </div>
            )}
          </div>
          <div className="music-player">
            <WebPlayback token={window.localStorage.getItem('access_token')}
              socketRef={socketRef}
              playerState={playerState}
              isHost={isHost}
              handleHostPlayerAction={handleHostPlayerAction}
              />
          </div>
          <div className={`chat-box ${isChatVisible ? 'visible' : 'hidden'}`}>
            {/* Add a button to toggle chat visibility */}
            <button onClick={toggleChatVisibility}>{isChatVisible ? 'Hide Chat' : 'Show Chat'}</button>
            {isChatVisible && (
              <div>
                <div className="messages">
                  {chat.map((obj, index) => (
                    <div key={index} className="message">
                      <span>{obj.name}: {obj.message}</span>
                      
                    </div>
                  ))}
                </div>
                <div className="message-input">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Send a message..."
                  />
                  <button onClick={handleSend}>Send</button>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    };
  

};



export default RoomDetail;



