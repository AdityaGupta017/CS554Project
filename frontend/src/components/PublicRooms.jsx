import React from 'react';
import { Typography, Card, CardContent } from '@mui/material';

function PublicRooms({ publicRooms, onCardClick }) {
  return (
    <div className='card' style={{ maxWidth: '800px', margin: '20px auto', overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
      {publicRooms && publicRooms.length > 0 ? (
        publicRooms.map(room => (
          <Card
            key={room._id}
            variant="outlined"
            onClick={() => onCardClick(room)}
            sx={{
              border: '1px solid #1e8678',
              boxShadow: '0 4px 15px 0 rgba(13, 144, 98, 0.2), 0 6px 20px 0 rgba(10, 156, 149, 0.19)',
              cursor: 'pointer',
              marginBottom: '10px',
              width: 'calc(50% - 10px)',
              transition: 'box-shadow 0.3s',
              '&:hover': {
                boxShadow: '0 19px 38px rgba(0,0,0,0.50);',
              },
            }}
          >
            <CardContent>
              <Typography variant="h6" className="dashboard">{room.title}</Typography>
              <Typography variant="body2" color="textSecondary">
                Code: {room._id}
              </Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="body1" className="dashboard">No public rooms available.</Typography>
      )}
    </div>
  );
}

export default PublicRooms;
