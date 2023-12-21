// Dashboard.js
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar,Toolbar,Button, TextField, Typography, Box } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import '../App.css';
import CreateRoomModal from './createRoomModal';
import axios from 'axios';
import SignOut from './SignOut';
import PublicRooms from './PublicRooms';
import NavigationBar from './NavigationBar';

function Dashboard() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isModalOpen, setModalOpen] = useState(false);
  const [accessToken, setAccessToken] = useState(undefined);
  const [publicRoomsData, setPublicRoomsData] = useState(undefined);
  const [roomCode, setRoomCode] = useState('');


  const handleModalClose = () => {
    setModalOpen(false);
  };

  const [loading, setLoading] = useState(false);

  const [isPublicRoomsModalOpen, setPublicRoomsModalOpen] = useState(false);
  const [showPublicRooms, setShowPublicRooms] = useState(false);

  const handleViewChange = (view) => {
    setCurrentView(view);
    if (view === 'publicRooms' && !publicRoomsData) {
      handlePublicRooms();
    }
  };

  const handleRoomCodeChange = (event) => {
    setRoomCode(event.target.value);
  };

  const handleJoinRoom = async () => {
    console.log('go to room detail');

    try {
      const response = await axios.get(`http://localhost:3000/rooms/${roomCode}`);
      const room = response.data;
      console.log('room is::::');
      console.log(room);

      navigate(`/rooms/${roomCode}`);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };


  const handlePublicRooms = async () => {
    try {
      const response = await axios.get('http://localhost:3000/rooms/publicRooms');
      const rooms = response.data;
      console.log("PUBLIC ROOMS:", rooms)
      setPublicRoomsData(rooms);
      // setPublicRoomsModalOpen(true);
     // setShowPublicRooms(true);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const handleCreateRoom = () => {
    console.log('create room button tapped');
    setModalOpen(true);
  };

  const spotifySignOn = async () => {
    try {
      const { data } = await axios.get('http://localhost:3000/users/login');
      window.location.href = data;
      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  const spotifyLogout = async () => {
    try {
      const { data } = await axios.get('http://localhost:3000/usersData/logout');
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const urlAccessToken = urlSearchParams.get('access_token');
    setAccessToken(urlAccessToken);

    if (!urlAccessToken) {
      spotifySignOn();
    }
  }, []); 

  useEffect(() => {
    if (accessToken) {
      window.localStorage.setItem('access_token', accessToken);
    }
  }, [accessToken]);

  return (
    <div>
      <NavigationBar currentView={currentView} onNavigate={handleViewChange} />

      {currentView === 'dashboard' && (
        <div className='card' style={{ backgroundColor: '#ffe4e1', padding: '20px', textAlign: 'center' }}>
          <Typography variant="h1" style={{ color: '#008080' }}>Music Mates</Typography>
          <Typography variant="h2" style={{ color: '#ff7f50' }}>Welcome back, {currentUser && currentUser.displayName}!</Typography>
          <Typography variant="body1">It's great to see you again.</Typography>
          
          <Button 
            onClick={handleCreateRoom} 
            style={{ backgroundColor: '#40e0d0', color: 'white', padding: '10px 20px', margin: '10px auto', display: 'block', width: '200px',height:'50px' }}
            variant="contained"
          >
            Create Room
          </Button>

          <CreateRoomModal currentUser={currentUser} isOpen={isModalOpen} onClose={handleModalClose} />

          <Box style={{ margin: '20px' }}>
            <label style={{ color: '#008080' }}>Have a room code? Join a room with it:</label>
            <TextField 
              type="text" 
              value={roomCode} 
              onChange={handleRoomCodeChange}
              style={{ margin: '10px' }}
            />
            <Button 
              onClick={handleJoinRoom}
              style={{ backgroundColor: '#ff7f50', color: 'white', padding: '10px 20px', margin: '10px auto', display: 'block',width: '200px',height:'50px' }}
              variant="contained"
            >
              Join
            </Button>
          </Box>

          {accessToken && (
            <>
              <Typography variant="h5" style={{ color: '#008080' }}>Wanna Logout? Click Below</Typography>
              <SignOut />
            </>
          )}
        </div>
      )}

      {currentView === 'publicRooms' && publicRoomsData && (
        <PublicRooms
          publicRooms={publicRoomsData}
          // onCardClick={(room) => navigate(`/rooms/${room._id}`)}
        />
      )}

      {/* {currentView === 'profile' && accessToken && (
        // Profile content goes here
      )} */}
    </div>
  );
}

export default Dashboard;
