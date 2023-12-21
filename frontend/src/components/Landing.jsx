import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';

const PageContainer = styled('div')({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#ffe4e1', // Misty Rose background for the whole page
});

const Header = styled('header')({
  width: '100%',
  padding: '20px 0',
  backgroundColor: '#008080', // Teal for the header
  color: 'white',
  textAlign: 'center',
  marginBottom: '40px',
});

const CustomLink = styled(Link)({
  textDecoration: 'none',
  margin: '0 10px', 
});

function Landing() {
  return (
    <PageContainer>
      
      <Typography variant="h5" gutterBottom sx={{ color: '#008080', marginBottom: '20px' }}>
        Welcome to Music Mates
      </Typography>
      <Typography variant="body1" sx={{ color: '#008080', textAlign: 'center', maxWidth: '600px', marginBottom: '30px' }}>
        Sync and share your music in real-time with friends, creating collaborative playlists and democratically controlling the vibe with a group voting feature. Join a room, queue songs, and enjoy a unified listening experience with those around you!
      </Typography>
      <Box sx={{ display: 'flex' }}>
        <CustomLink to='/signin'>
          <Button 
            variant='contained' 
            sx={{ bgcolor: '#40e0d0', color: 'white', '&:hover': { bgcolor: '#40e0d0', opacity: [0.9, 0.8, 0.7] } }}
          >
            Sign In
          </Button>
        </CustomLink>
        <CustomLink to='/signup'>
          <Button 
            variant='contained' 
            sx={{ bgcolor: '#ff7f50', color: 'white', '&:hover': { bgcolor: '#ff7f50', opacity: [0.9, 0.8, 0.7] } }}
          >
            Sign Up
          </Button>
        </CustomLink>
      </Box>
    </PageContainer>
  );
}

export default Landing;
