import { Router } from 'express';
export const router = Router();
import axios from 'axios';

const BASE_URL = 'https://api.spotify.com/v1';

// Getting Spotify Playback State
// Permission Needed: user-read-playback-state
// TODO: Change this to GET (make sure fetch call method is GET too)
router.post('/search', async (req, res) => {

	console.log('In API call: Search');

	// Get the searchterm from body
	const searchTerm = req.body.searchTerm;
    const access_token = req.session.user.access_token;

	const SEARCH_URL = BASE_URL + `/search?q=${searchTerm}&type=track`;

	try {
		// Call Spotify Search endpoint to get all results for search term
		// Only info given is track IDs
		const { data: searchResults } = await axios.get(SEARCH_URL, {
			headers: {
				'Authorization': 'Bearer ' + access_token
			}
		});

		// Get all the track IDs
		const resultIDs = searchResults.tracks.items.map(track => track.id);
		
		const TRACKS_URL = BASE_URL + `/tracks?ids=${resultIDs.join(',')}`;

		// Call Spotify Tracks endpoint to get track info for multiple (up to 50) tracks
		const { data: trackResults } = await axios.get(TRACKS_URL, {
			headers: {
				'Authorization': 'Bearer ' + access_token
			}
		});

		// Filter the array of tracks to only return neccessary info (track name, artists, and image)
		const trackInfo = trackResults.tracks.map(track => {
			return {
				id: track.id,
				uri: track.uri,
				name: track.name,
				artists: track.artists.map(artist => artist.name),
				image: track.album.images[2].url
			};
		});
		
		return res.send(trackInfo);
	} catch (error) {
		// console.log(error.response.data);

		// Recieving 400 status from Spotify API means 'No search query'
		// Return an empty array when there is no value in the search bar
		if(error.response && error.response.data && error.response.data.error.status === 400) {
			return res.send([]);
		}
	}


});

router.post('/add-track', async (req, res) => {
	console.log('In API Call: Add Track');

	const { trackUri, deviceId } = req.body;
    const access_token = req.session.user.access_token;

	const ADD_TO_PLAYBACK_QUEUE_URL = BASE_URL + `/me/player/queue?uri=${trackUri}&device_id=${deviceId}`;

	try {
		const { data } = await axios.post(ADD_TO_PLAYBACK_QUEUE_URL, undefined, {
			headers: {
				'Authorization': 'Bearer ' + access_token
			}
		});

		// Call does not return anything on success
		console.log(data);
	} catch (error) {
		console.log(error.response);
	}

});

router.post('/transfer-playback', async (req, res) => {
	console.log('In API Call: Transfer Playback');

	const { deviceId } = req.body;
    const access_token = req.session.user.access_token;

	const TRANFER_PLAYBACK_URL = BASE_URL + `/me/player`;

	try {
		const { data } = await axios.put(TRANFER_PLAYBACK_URL, {
			device_ids: [deviceId]
		}, {
			headers: {
				'Authorization': 'Bearer ' + access_token,
				'Content-Type': 'application/json'
			}
		});

        // This Spotify endpoint returns nothing on a success
		console.log(data);
 	} catch (error) {
		console.log(error.response);
	}
});

router.get('/playback-state', async (req, res) => {
	console.log('In API Call: Get Playback State');

    const access_token = req.session.user.access_token;

	const GET_PLAYBACK_STATE_URL = BASE_URL + '/me/player';

	try {
		const { data } = await axios.get(GET_PLAYBACK_STATE_URL, {
			headers: {
				'Authorization': 'Bearer ' + access_token
			}
		});
		
        // This Spotify endpoint returns nothing on a success
		console.log(data);
	} catch (error) {
		console.log(error.response);
	}
})   
    .post('/playback-state', async (req, res) => {
	console.log('In API Call: Set Playback State');

	const { time } = req.body;
    const access_token = req.session.user.access_token;

	// Time in milliseconds
	const SET_PLAYBACK_STATE_URL = BASE_URL + `/me/player/seek?position_ms=${time}`;

	try {
		const { data } = await axios.put(SET_PLAYBACK_STATE_URL, undefined, {
			headers: {
				'Authorization': 'Bearer ' + access_token
			}
		});

        // This Spotify endpoint returns nothing on sucess
        console.log(data);
	} catch (error) {
		console.log(error);
	}
});

router.post('/set-track', async (req, res) => {
    console.log('In API Call: Set Track');
	console.log(req.body)

    const { trackUris , position } = req.body;
	
    const access_token = req.session.user.access_token;

    const SET_PLAYER_URL = BASE_URL + '/me/player/play';

    try {
        await axios.put(SET_PLAYER_URL, {
            uris: trackUris,
			position_ms: position
        }, {
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'Content-Type': 'application/json',
            }
        });

        // This Spotify endpoint returns nothing on success
        return res.status(200).json({message: 'Successful Call to Set Track'});
    } catch (error) {
        console.log(error);
    }
});

export default router;