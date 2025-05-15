
import { useState, useEffect, useCallback } from 'react';
import { spotifyApi } from '@/lib/spotify';

export const useSpotifyPlayer = (token, currentTrack, appIsShuffle, appSetIsShuffle, localTogglePlayPause, localToggleRepeat, toast, onNextSpotify, onPreviousSpotify) => {
  const [deviceId, setDeviceId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRepeat, setIsRepeat] = useState({ isRepeating: false, mode: 'off' }); // mode: 'off', 'context', 'track'
  // appIsShuffle is managed by usePlayerControls, passed down

  useEffect(() => {
    if (!token) return;

    const initSpotifyWebPlaybackSDK = () => {
      if (window.Spotify && window.Spotify.Player) {
        const player = new window.Spotify.Player({
          name: 'AuraBeat Web Player',
          getOAuthToken: cb => { cb(token); },
          volume: 0.5 // Initial volume
        });

        player.addListener('ready', ({ device_id }) => {
          setDeviceId(device_id);
          toast({ title: "Spotify Player Ready", description: "Device connected for playback."});
          spotifyApi.transferPlayback(token, [device_id], false).catch(e => console.error("Failed to transfer playback initially", e));
        });

        player.addListener('not_ready', ({ device_id }) => {
          console.warn('Device ID has gone offline', device_id);
          setDeviceId(null);
        });
        
        player.addListener('initialization_error', ({ message }) => { console.error('Failed to initialize Spotify Player', message); });
        player.addListener('authentication_error', ({ message }) => { 
            console.error('Failed to authenticate Spotify Player', message); 
            toast({title: "Spotify Auth Error", description: "Player auth failed. Try refreshing or re-logging.", variant: "destructive"});
        });
        player.addListener('account_error', ({ message }) => { 
            console.error('Spotify Player account error', message); 
            toast({title: "Spotify Account Error", description: "Check your Spotify account (e.g. Premium status).", variant: "destructive"});
        });
        player.addListener('playback_error', ({ message }) => { 
            console.error('Spotify Player playback error', message);
            toast({title: "Spotify Playback Error", description: message, variant: "destructive"});
        });


        player.addListener('player_state_changed', (state) => {
          if (!state) return;
          setIsPlaying(!state.paused);
          appSetIsShuffle(state.shuffle);
          setIsRepeat({ isRepeating: state.repeat_mode !== 0, mode: state.repeat_mode === 1 ? 'context' : state.repeat_mode === 2 ? 'track' : 'off' });
          
          // If Spotify starts playing a track that's different from local currentTrack, update local currentTrack
          // This requires more complex state management to avoid conflicts
          // For now, we primarily control from local actions
        });

        player.connect().then(success => {
          if (!success) {
            console.warn("Spotify Player failed to connect");
          }
        });

        return () => {
          player.disconnect();
        };
      } else {
        // Retry if SDK not loaded yet
        const timeoutId = setTimeout(initSpotifyWebPlaybackSDK, 500);
        return () => clearTimeout(timeoutId);
      }
    };
    
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);
    window.onSpotifyWebPlaybackSDKReady = initSpotifyWebPlaybackSDK;

    return () => {
      document.body.removeChild(script);
      window.onSpotifyWebPlaybackSDKReady = null;
    };

  }, [token, toast, appSetIsShuffle]);


  const handleSpotifyPlayPause = useCallback(async () => {
    if (!token || !deviceId || !currentTrack?.uri) {
        localTogglePlayPause(); // Fallback to local if conditions not met
        return;
    }
    try {
      if (isPlaying) {
        await spotifyApi.pausePlayback(token, deviceId);
      } else {
        await spotifyApi.playTrack(token, deviceId, [currentTrack.uri]);
      }
      setIsPlaying(!isPlaying); // Assume success for UI update
    } catch (error) {
      toast({ title: "Spotify Playback Error", description: error.message, variant: "destructive" });
    }
  }, [token, deviceId, currentTrack, isPlaying, toast, localTogglePlayPause]);

  const handleSpotifyRepeatToggle = useCallback(async () => {
    if (!token || !deviceId) {
        localToggleRepeat(); // Fallback
        return;
    }
    try {
      let newMode = 'off';
      if (isRepeat.mode === 'off') newMode = 'context';
      else if (isRepeat.mode === 'context') newMode = 'track';
      // else it's 'track', so it goes to 'off'
      
      await spotifyApi.setRepeatMode(token, newMode, deviceId);
      setIsRepeat({ isRepeating: newMode !== 'off', mode: newMode });
      toast({ title: `Repeat ${newMode !== 'off' ? newMode.charAt(0).toUpperCase() + newMode.slice(1) : 'Off'}` });
    } catch (error) {
      toast({ title: "Spotify Repeat Error", description: error.message, variant: "destructive" });
    }
  }, [token, deviceId, isRepeat, toast, localToggleRepeat]);

  const handleSpotifyShuffleToggle = useCallback(async () => {
    if (!token || !deviceId) {
        appSetIsShuffle(!appIsShuffle); // Fallback
        toast({ title: !appIsShuffle ? "Shuffle On (Local)" : "Shuffle Off (Local)" });
        return;
    }
    const newShuffleState = !appIsShuffle;
    try {
      await spotifyApi.setShuffleMode(token, newShuffleState, deviceId);
      appSetIsShuffle(newShuffleState);
      toast({ title: newShuffleState ? "Shuffle On" : "Shuffle Off" });
    } catch (error) {
      toast({ title: "Spotify Shuffle Error", description: error.message, variant: "destructive" });
    }
  }, [token, deviceId, appIsShuffle, appSetIsShuffle, toast]);
  
  const handleSpotifyVolumeChange = useCallback(async (newVolumeArray) => {
    if (!token || !deviceId) return;
    const volumePercent = newVolumeArray[0];
    try {
      await spotifyApi.setVolume(token, volumePercent, deviceId);
      // Volume state for slider is managed locally by useAudioPlayer hook
    } catch (error) {
      toast({ title: "Spotify Volume Error", description: error.message, variant: "destructive" });
    }
  }, [token, deviceId, toast]);


  return { 
    deviceId, 
    isPlaying, // This is Spotify's playing state if SDK is active
    isRepeat, // Spotify's repeat state
    handleSpotifyPlayPause, 
    handleSpotifyRepeatToggle,
    handleSpotifyShuffleToggle,
    handleSpotifyVolumeChange,
  };
};
