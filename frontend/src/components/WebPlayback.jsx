
import { useState, useEffect, useRef } from 'react';
import SearchModal from './search/SearchModal';
import MusicPlayerScrubber from './MusicPlayerScrubber';

import DeviceContext from '../context/DeviceContext';
import axios from 'axios';

const track = {
	name: "",
	album: {
		images: [
			{ url: "" }
		]
	},
	artists: [
		{ name: "" }
	]
}

function WebPlayback(props) {

	let counter = 0

	const [is_paused, setPaused] = useState(false);
	const [is_active, setActive] = useState(false);
	const [player, setPlayer] = useState(undefined);
	const [current_track, setTrack] = useState(track);
	const [queue, setQueue] = useState([]);
	const [selfUpdate, setSelfUpdate] = useState(true)
	const deviceID = useRef(null);
	// const [playBackState, setPlayBackState] = useState(undefined)

	// const [playbackResponse, setPlaybackResponse] = useState(undefined)

	const [showSearchModal, setShowSearchModal] = useState(false);
    // counter += 1
	// console.log('myplayerstate:::::::::')
	// // console.log(counter)
	// // console.log(props.playerState)

	
	let shouldEmit = true



	useEffect(() => {
		console.log('inside my useEffect myplayerstate update')
		
			    console.log('recieved updated state in WebPlayback')
                console.log(props.playerState)
				

				const fetchData = async () => {
					console.log('called fetchdata in useeffect:::: ')
					let test = [props.playerState.current_track];

					if (props.playerState.paused) {
						player.togglePlay()
						return
					}

					
					try {

						
							let test2 = props.playerState.next_tracks.map(track => track.uri);
							test = [props.playerState.current_track, ...test2]
						
						console.log('my uris::::')
						console.log(test)
						
						    
							const { data } = await axios.post('/api/set-track', {
								trackUris: test,
								position: props.playerState.position
								
							});

							// setTimeout(() => {
							// 	if (props.playerState.paused === true) {
							// 		player.pause().then(() => {
							// 			console.log('Paused!');
							// 		  });
							// 	}
							// }, 300);
							

							
							
							
							console.log(data);

							
						

					
					} catch (error) {
						setSelfUpdate(true)
						console.log(error);
					}
				};

                
			    
				fetchData()
				

		
	  }, [props.playerState]); // Effect will re-run if props.playbackState changes
	  

	useEffect(() => {

		const script = document.createElement("script");
		script.src = "https://sdk.scdn.co/spotify-player.js";
		script.async = true;

		document.body.appendChild(script);

		window.onSpotifyWebPlaybackSDKReady = () => {

			const player = new window.Spotify.Player({
				name: 'Web Playback SDK',
				getOAuthToken: cb => { cb(props.token); },
				volume: 0.5
			});

			setPlayer(player);

			player.addListener('ready', ({ device_id }) => {
				console.log('Ready with Device ID', device_id);
				deviceID.current = device_id;
				fetchData(device_id);
			});

			player.addListener('not_ready', ({ device_id }) => {
				console.log('Device ID has gone offline', device_id);
			});

			player.addListener('player_state_changed', ( async state => {
				console.log('listener function player_state_changed')
				
			
				if (!state) {
					return;
				}

				setTrack(state.track_window.current_track);
				setQueue(state.track_window.next_tracks.slice(0, 5));
				setPaused(state.paused);



				player.getCurrentState().then(state => {
					(!state) ? setActive(false) : setActive(true)
				});

				console.log('inside listener::::::')
				console.log(state)
				
				 

			}));

			player.connect();

		};

		

	}, []);

	const emitPlayerState = (state) => {
		console.log('emit playerstatechanged called:::::')
					props.socketRef.current.emit('player_state_changed', {
						state
					  });
	}

	// API Call to get Playback State 
	// SetInterval to retrieve state every x seconds

	// const getPlaybackState = async () => {
	// 	try {
	// 		const { data } = await axios.get('/api/playback-state');
    //         console.log('my playback data::::::')
	// 		console.log(data);
	// 		setPlaybackResponse(data)
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// };

	// setInterval(() => {
	// 	console.log('Getting Playback State');
	// 	getPlaybackState();
	// }, 1000);
	
	const fetchData = async (deviceId) => {
		try {
			const { data } = await axios.post('/api/transfer-playback', {
				deviceId: deviceId
			});

			console.log(data);
		} catch (error) {
			console.log(error)
		}
	}

	const handleCloseModals = () => {
		setShowSearchModal(false);
	}

	

	if (!is_active) {
		return (
			<>
			<DeviceContext.Provider value={{ deviceID: deviceID.current }}>
				<div className="container">
					<div className="main-wrapper">
						<b> Instance not active. Transfer your playback using your Spotify app </b>
					</div>

					<div>
						<button onClick={() => { setShowSearchModal(true); }}>
							Search for Songs
						</button>
					</div>

					{showSearchModal && (
						<SearchModal 
							isOpen={showSearchModal}
							handleClose={handleCloseModals}
						/>
					)}
				</div>
			</DeviceContext.Provider>
			</>)
	} else {
		return (
			<>
				<DeviceContext.Provider value={{ deviceID: deviceID.current }}>
					<div className="container">
						<div className="main-wrapper">

							<img src={current_track.album.images[0].url} className="now-playing__cover" alt="" />
							{/* <MusicPlayerScrubber playbackResponse={playbackResponse}/> */}


							<div className="now-playing__side">
								<div className="now-playing__name">{current_track.name}</div>
								<div className="now-playing__artist">{current_track.artists[0].name}</div>

								{props.isHost && (
          <>
           <button className="btn-spotify" onClick={() => { 
									// setSelfUpdate(true)
									player.previousTrack() 
									setTimeout(() => {
										player.getCurrentState().then(mystate => {
											console.log('after previous track')
											console.log(mystate)
											emitPlayerState(mystate)
											props.handleHostPlayerAction('Host skipped to previous song in queue')
										});
									}, 100);
									}} >
									&lt;&lt;
								</button>

								<button className="btn-spotify" onClick={() => {
									//  setSelfUpdate(true)
									 player.togglePlay() 
									 
									 // Set a delay of 100 milliseconds (adjust as needed)
									setTimeout(() => {
										player.getCurrentState().then(mystate => {
											console.log('after toggle play')
											console.log(mystate)
											emitPlayerState(mystate)
										});
										props.handleHostPlayerAction('Host toggled play state of song')
									}, 100);
									 }} >
									{is_paused ? "PLAY" : "PAUSE"}
									
								</button>

								<button className="btn-spotify" onClick={() => { 
									// setSelfUpdate(true)
									player.nextTrack() 
									setTimeout(() => {
										player.getCurrentState().then(mystate => {
											console.log('after next track')
											console.log(mystate)
											emitPlayerState(mystate)
										});
										props.handleHostPlayerAction('Host skipped to next song in queue')
									}, 100);
									}} >
									&gt;&gt;
								</button>
          </>
        )}
								{/* <button className="btn-spotify" onClick={() => { 
									// setSelfUpdate(true)
									player.previousTrack() 
									setTimeout(() => {
										player.getCurrentState().then(mystate => {
											console.log('after previous track')
											console.log(mystate)
											emitPlayerState(mystate)
										});
									}, 100);
									}} >
									&lt;&lt;
								</button>

								<button className="btn-spotify" onClick={() => {
									//  setSelfUpdate(true)
									 player.togglePlay() 
									 // Set a delay of 100 milliseconds (adjust as needed)
									setTimeout(() => {
										player.getCurrentState().then(mystate => {
											console.log('after toggle play')
											console.log(mystate)
											emitPlayerState(mystate)
										});
									}, 100);
									 }} >
									{is_paused ? "PLAY" : "PAUSE"}
								</button>

								<button className="btn-spotify" onClick={() => { 
									// setSelfUpdate(true)
									player.nextTrack() 
									setTimeout(() => {
										player.getCurrentState().then(mystate => {
											console.log('after next track')
											console.log(mystate)
											emitPlayerState(mystate)
										});
									}, 100);
									}} >
									&gt;&gt;
								</button> */}
							</div>

                            <div>
								<button onClick={() => { setShowSearchModal(true); }}>
									Search for Songs
								</button>
							</div>

							<div className='queued_songs_list'>
								<h4>Queued Songs</h4>
								{queue.map(track => {
									return (
										<div key={track.uri}>
											<img src={track.album.images[1].url}/>
											<div className="queue__name">{track.name}</div>
											<div className="queue__artist">{track.artists[0].name}</div>
										</div>
									)
								})}
							</div>

							{showSearchModal && (
								<SearchModal 
									isOpen={showSearchModal}
									handleClose={handleCloseModals}
								/>
							)}
						</div>
					</div>
				</DeviceContext.Provider>
			</>
		);
	}
}

export default WebPlayback

