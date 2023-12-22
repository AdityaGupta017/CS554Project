
import React, { useContext, useState } from 'react';
import DeviceContext from '../../context/DeviceContext';
import axios from 'axios';
import { Button, Card, CardContent, CardMedia, Typography } from '@mui/material';

export default function SearchResult(props) {
    const { result } = props;
    const [inQueue, setInQueue] = useState(false);
    const { deviceID } = useContext(DeviceContext);

    const fetchData = async (trackUri) => {
        try {
            const { data } = await axios.post('/api/add-track', {
                deviceId: deviceID,
                trackUri: trackUri,
            });
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleClick = () => {
        fetchData(result.uri);
        setInQueue(true);
    };

    return (
        <Card className="card" sx={{ margin: '10px', boxShadow: 3 }}>
            <CardContent>
                <Typography variant="h6" component="h3">
                    {result.name}
                </Typography>
                <Typography variant="subtitle1" component="p">
                    {result.artists.join(', ')}
                </Typography>
            </CardContent>
            <CardMedia
                component="img"
                image={result.image}
                alt={result.name}
                sx={{ width: '100%', height: 'auto' }}
            />
            <CardContent>
                {!inQueue ? (
                    <Button
                        onClick={() => handleClick()}
                        variant="contained"
                        style={{ backgroundColor: '#ff7f50'}}
                        className="button"
                    >
                        Add to Queue
                    </Button>
                ) : (
                    <Button variant="contained" disabled className="button">
                        ✔️ In Queue
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
