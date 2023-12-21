import React from 'react';
import { useNavigate } from 'react-router-dom';
import { doSignOut } from '../firebase/FirebaseFunctions';
import Button from '@mui/material/Button';
import axios from 'axios';

// const CLIENT_ID = 'a6f63d2a45c74623bf975fbdb4538e69' // Your client id

// const redirect_uri = 'http://localhost:5173/signin'; // Your redirect uri
// const scope = "streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state";

const SignOut = () => {
  const navigate = useNavigate();


  const handleSignOut = async () => {
    try {
      // Clear Spotify tokens and related data
      clearSpotifyTokens();
      
      
      await doSignOut();

      
      await axios.get('http://localhost:3000/usersData/logout');
      
      // Redirect to the Spotify logout URL
      redirectToSpotifyLogout();

      

      // Redirect to the sign-in page
      navigate('/signin');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const clearSpotifyTokens = () => {
   
    
    // Clear Spotify access token
    localStorage.removeItem('accessToken');

    // Clear Spotify refresh token
    localStorage.removeItem('refresh-token');

    // Clear Spotify user data (if stored)
    // localStorage.removeItem('spotifyUserData');
  };

  const redirectToSpotifyLogout = () => {
    
    // Redirect the user to the Spotify logout URL
    window.location.href = 'https://accounts.spotify.com/logout';

    // Optionally, add the show_dialog=true query parameter to the Spotify login URL
    // if you want the user to be able to log in with a different account
    // window.location.href = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirect_uri}&response_type=token&scope=${scope}`;
  };

  return (
    <Button className='button' type='button' onClick={handleSignOut}>
      Sign Out
    </Button>
  );
};

export default SignOut;
