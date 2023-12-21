import React from 'react';
import  {doSocialSignIn} from '../firebase/FirebaseFunctions';
import axios from 'axios';
import GoogleIcon from '@mui/icons-material/Google';
import {Button} from '@mui/material';

const SocialSignIn = () => {
  const socialSignOn = async () => {
    try {
       await doSocialSignIn();
      const user = JSON.parse(localStorage.getItem('user'));
      console.log(user);
      const userData = {
        name: user.displayName || 'Default Name',
        email: user.email
      };

      console.log("Entering user data to database");
        
      await axios.post('http://localhost:3000/usersData/signup', userData);
      await axios.post('http://localhost:3000/usersData/login', {
        email: user.email,
      });

    } catch (error) {
      alert(error);
    }
  };
  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <Button 
        variant="contained" 
        onClick={socialSignOn} 
        startIcon={<GoogleIcon />}
        style={{ 
          backgroundColor: '#008080', 
          color: 'white',
          textTransform: 'none',
          fontWeight: 'bold',
          padding: '10px 20px',
        }}
      >
        Sign in with Google
      </Button>
    </div>
  );
};

export default SocialSignIn;
