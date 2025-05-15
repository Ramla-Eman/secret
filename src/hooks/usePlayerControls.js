
import { useState, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { getMockTrack, getMockData } from "@/lib/spotify";

export const usePlayerControls = (token, currentPlaylist, searchResults, playlists, newReleases, featuredPlaylists) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isShuffle, setIsShuffle] = useState(false);
  const { toast } = useToast();

  const handlePlayTrack = useCallback((trackInput) => {
    let trackToPlay = trackInput;

    if (!trackToPlay) {
      if (currentPlaylist && currentPlaylist.tracks?.items?.length > 0) {
        trackToPlay = currentPlaylist.tracks.items[0].track;
      } else if (newReleases.length > 0 && newReleases[0].tracks?.items?.length > 0) {
         trackToPlay = newReleases[0].tracks.items[0].track;
      } else {
        trackToPlay = getMockTrack(); 
      }
    }
    
    if (trackToPlay && trackToPlay.preview_url) {
      setCurrentTrack(trackToPlay);
      toast({
        title: "Now Playing (Preview)",
        description: `${trackToPlay.name} by ${trackToPlay.artists?.map(a => a.name).join(", ") || 'Unknown Artist'}`,
      });
    } else if (trackToPlay && !trackToPlay.preview_url) {
      toast({
        title: "Track Preview Not Available",
        description: `"${trackToPlay.name}" does not have a preview. Full playback requires Spotify Premium & Web Playback SDK.`,
        variant: "destructive",
        duration: 7000,
      });
       if (token) setCurrentTrack(trackToPlay); // Allow attempting to play via Spotify SDK if logged in
    } else {
       toast({
        title: "No Track Available",
        description: "Could not find a track to play.",
        variant: "destructive",
      });
    }
  }, [currentPlaylist, newReleases, toast, token]);

  const playNextOrPrevious = useCallback((direction, currentView) => {
    if (!currentTrack && !(currentPlaylist?.tracks?.items?.length > 0)) {
      handlePlayTrack(getMockTrack());
      return;
    }

    let sourceList = [];
    if (currentView === 'playlist' && currentPlaylist?.tracks?.items) {
      sourceList = currentPlaylist.tracks.items;
    } else if (currentView === 'search' && searchResults?.tracks?.items) {
      sourceList = searchResults.tracks.items.map(t => ({track: t}));
    } else { 
      const allMockTracks = getMockData("tracks").map(t => ({track: t}));
      const featuredTracks = featuredPlaylists.flatMap(p => p.tracks?.items || []);
      const releaseTracks = newReleases.flatMap(r => r.albums?.[0]?.tracks?.items || r.tracks?.items || []);
      
      sourceList = [...featuredTracks, ...releaseTracks];
      if(sourceList.length === 0 && !token) sourceList = allMockTracks;
      if(sourceList.length === 0 && token && playlists.length > 0 && playlists[0].tracks?.items){
         sourceList = playlists[0].tracks.items; // fallback to first user playlist if logged in
      }
    }
    
    if (sourceList.length === 0) {
      toast({ title: "No tracks in queue", variant: "destructive" });
      return;
    }

    const trackList = sourceList.map(item => item.track).filter(t => t && (t.preview_url || token));
    if (trackList.length === 0) {
      toast({ title: "No playable tracks with previews", variant: "destructive" });
      return;
    }

    let currentIndex = currentTrack ? trackList.findIndex(t => t.id === currentTrack.id) : -1;
    let nextIndex;

    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * trackList.length);
      if (trackList.length > 1 && nextIndex === currentIndex) { 
        nextIndex = (nextIndex + 1) % trackList.length;
      }
    } else {
      if (direction === "next") {
        nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % trackList.length;
      } else { 
        nextIndex = currentIndex === -1 ? trackList.length -1 : (currentIndex - 1 + trackList.length) % trackList.length;
      }
    }
    
    if (trackList[nextIndex]) {
      handlePlayTrack(trackList[nextIndex]);
    } else if (trackList.length > 0) { 
      handlePlayTrack(trackList[0]);
    }

  }, [currentTrack, currentPlaylist, searchResults, featuredPlaylists, newReleases, playlists, token, isShuffle, handlePlayTrack, toast]);

  const handleNextTrack = useCallback((currentView) => playNextOrPrevious("next", currentView), [playNextOrPrevious]);
  const handlePreviousTrack = useCallback((currentView) => playNextOrPrevious("prev", currentView), [playNextOrPrevious]);

  return { currentTrack, setCurrentTrack, isShuffle, setIsShuffle, handlePlayTrack, handleNextTrack, handlePreviousTrack };
};
