import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';

function NavigationBar({ currentView, onNavigate }) {
  return (
    <AppBar position="static" style={{ backgroundColor: '#008080', marginBottom: '20px' }}>
      <Toolbar>
        <Button color="inherit" onClick={() => onNavigate('dashboard')} disabled={currentView === 'dashboard'}>Dashboard</Button>
        <Button color="inherit" onClick={() => onNavigate('publicRooms')} disabled={currentView === 'publicRooms'}>Browse Public Rooms</Button>
        <Button color="inherit" onClick={() => onNavigate('profile')} disabled={currentView === 'profile'}>Profile</Button>
      </Toolbar>
    </AppBar>
  );
}

export default NavigationBar;
