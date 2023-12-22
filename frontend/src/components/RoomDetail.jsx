
// import React, { useState } from 'react';

import WebPlayback from './WebPlayback';
import io from 'socket.io-client';
import React,{useRef, useState, useEffect, useContext} from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Snackbar } from '@mui/material';

const RoomDetail = () => {
  const navigate = useNavigate();
  const [chat, setChat] = useState([{name:'a',message:'hello'}]); // Placeholder for chat messages
  const [newMessage, setNewMessage] = useState('');

  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar open/close
  const [snackbarMessage, setSnackbarMessage] = useState(''); // State for Snackbar message


  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);

  const [playerState, setPlayerState] = useState(undefined)
  const { currentUser } = useContext(AuthContext);
  const [isHost, setIsHost] = useState(false)

  const { roomId } = useParams(); // Retrieve roomId from URL
  console.log('roomid isss')
  console.log(roomId)
  const [roomInfo, setRoomInfo] = useState(undefined); // State to hold room info
  const [isChatVisible, setIsChatVisible] = useState(true);

  const handleLike = () => {
    socketRef.current.emit('like', { roomId , likes: likes + 1});
  };
  
  const handleDislike = () => {
    socketRef.current.emit('dislike', { roomId, dislikes: dislikes + 1 });
  };

  const handleQuitRoom = () => {
    // Perform any necessary cleanup
    socketRef.current.disconnect();   
    navigate('/dashboard'); 
  };

  const handleVote = (voteType) => {
    if (!hasVoted) {
      socketRef.current.emit(voteType, { roomId });
      setHasVoted(true);
    }
  };


  const toggleChatVisibility = () => {
    setIsChatVisible(!isChatVisible);
  };


  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io('https://backend.musicmates.club');
    socketRef.current.emit('user_join', currentUser.displayName);
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    socketRef.current.on('poll_update', ({ likes, dislikes }) => {
      setLikes(likes);
      setDislikes(dislikes);
    });
  
    return () => {
      socketRef.current.off('poll_update');
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
        const response = await axios.get(`https://backend.musicmates.club/rooms/${roomId}`);
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

  const copyRoomIdToClipboard = () => {
    navigator.clipboard.writeText(roomId).then(() => {
      console.log('Room ID copied to clipboard');
      setSnackbarMessage('Room ID copied to clipboard'); 
      setSnackbarOpen(true); 
      
    }).catch(err => {
      console.error('Failed to copy Room ID: ', err);
      
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return; 
    }
    setSnackbarOpen(false); 
  };

  const style = {
    container: { padding: '20px' },
    header: { marginBottom: '20px' },
    player: { marginBottom: '20px' },
    chatBox: {
      marginBottom: '20px',
      display: 'flex',         // Enable flexbox
      flexDirection: 'column', // Stack children vertically
      alignItems: 'center',    // Center children horizontally
      justifyContent: 'center' // Center children vertically
    },
    messages: { maxHeight: '300px', overflowY: 'auto' },
    messageInput: { marginTop: '10px' },
    pollingSection: { marginTop: '20px', textAlign: 'center' }
  };

  if (!roomInfo) {
    
      return <Typography variant="h4">Getting Room Info</Typography>;
    
  } else {
    return (
      <Container style={style.container}>
        <Box style={style.header}>
          <Typography variant="h4">Welcome to {roomInfo && roomInfo.title}</Typography>
          <Typography>{isHost ? 'You are the host of this room' : 'Welcome! Wait for the host to start the music party'}</Typography>
        </Box>

        <Box style={style.player}>
          <WebPlayback
            token={window.localStorage.getItem('access_token')}
            socketRef={socketRef}
            playerState={playerState}
            isHost={isHost}
            handleHostPlayerAction={handleHostPlayerAction}
          />
        </Box>

        <Box className={`chat-box ${isChatVisible ? 'visible' : 'hidden'}`} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' , alignSelf: 'center', color: 'lightblue', marginLeft:'10px'}}>
  <Button 
    variant="outlined" 
    onClick={toggleChatVisibility}
    style={{ backgroundColor: '#40e0d0'}} 
    sx={{ marginBottom: 2 }} // Add margin for spacing
  >
    {isChatVisible ? 'Hide Chat' : 'Show Chat'}
  </Button>

  {isChatVisible && (
    <Box sx={{ width: '100%', maxWidth: '600px' , color: 'gray'}}> 
      <Box className="messages" sx={{ width: '100%' }}> {/* Ensure messages take full width */}
        {chat.map((obj, index) => (
          <Typography key={index} sx={{ textAlign: 'center' }}>{obj.name}: {obj.message}</Typography>
        ))}
      </Box>
      <Box className="message-input" sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <TextField
          fullWidth
          variant="outlined"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Send a message..."
          className="form-control"
          sx={{ flexGrow: 1, marginRight: 2 }} // Adjust TextField width
        />
        <Button 
          variant="contained" 
          onClick={handleSend}
          style={{ backgroundColor: '#40e0d0',width:'100px',height:'40px'}} 
        >
          Send
        </Button>
      </Box>
    </Box>
  )}
</Box>


        <Box style={style.pollingSection}>
  <Button
    variant="contained"
    style={{ backgroundColor: '#40e0d0',width:'100px',height:'40px'}} 
    onClick={() => handleVote('like')}
    disabled={hasVoted}
  >
    Like
  </Button>
  <Typography component="span">{likes}</Typography>
  <Button
    variant="contained"
    style={{ backgroundColor: '#40e0d0',width:'100px',height:'40px'}} 
    onClick={() => handleVote('dislike')}
    disabled={hasVoted}
  >
    Dislike
  </Button>
  <Typography component="span">{dislikes}</Typography>
</Box>
      <Button
        variant="contained"
        onClick={handleQuitRoom}
        style={{ backgroundColor: '#008080', width: '150px', height: '40px', marginTop: '20px',marginRight: '10px' }}
      >
        Quit Room
      </Button>
      <Button
          variant="contained"
          onClick={copyRoomIdToClipboard}
          style={{ backgroundColor: '#008080', width: '150px', height: '40px', marginTop: '20px' }}
        >
          Copy Room ID
        </Button>

        <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
      
      </Container>
    );
    };
  

};



export default RoomDetail;



