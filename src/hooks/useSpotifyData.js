
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { spotifyApi, getMockData, getMockPlaylist } from "@/lib/spotify";

export const useSpotifyData = (token) => {
  const [playlists, setPlaylists] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const { toast } = useToast();

  const fetchInitialData = useCallback(async () => {
    if (!token) {
      setPlaylists(getMockData("playlists"));
      setNewReleases(getMockData("new-releases"));
      setFeaturedPlaylists(getMockData("featured-playlists"));
      setCategories(getMockData("categories"));
      return;
    }

    try {
      const [playlistsData, featuredData, releasesData, categoriesData] = await Promise.all([
        spotifyApi.getMyPlaylists(token, 30).catch(e => { console.error("getMyPlaylists failed", e); return {items:[]};}),
        spotifyApi.getFeaturedPlaylists(token, 10).catch(e => { console.error("getFeaturedPlaylists failed", e); return {playlists:{items:[]}};}),
        spotifyApi.getNewReleases(token, 10).catch(e => { console.error("getNewReleases failed", e); return {albums:{items:[]}};}),
        spotifyApi.getCategories(token, 20).catch(e => { console.error("getCategories failed", e); return {categories:{items:[]}};})
      ]);

      setPlaylists(playlistsData.items || []);
      setFeaturedPlaylists(featuredData.playlists?.items || []);
      setNewReleases(releasesData.albums?.items || []);
      setCategories(categoriesData.categories?.items || []);
      
    } catch (error) {
      console.error("Error fetching Spotify data:", error);
      // This generic catch might not be hit if individual promises have their own catches
      toast({
        title: "Spotify API Error",
        description: "Could not fetch some initial data. Functionality may be limited.",
        variant: "destructive",
      });
      // Fallback for any top-level error not caught by individual promises
      if (playlists.length === 0) setPlaylists(getMockData("playlists"));
      if (newReleases.length === 0) setNewReleases(getMockData("new-releases"));
      if (featuredPlaylists.length === 0) setFeaturedPlaylists(getMockData("featured-playlists"));
      if (categories.length === 0) setCategories(getMockData("categories"));
    }
  }, [token, toast, playlists.length, newReleases.length, featuredPlaylists.length, categories.length]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handlePlaylistSelect = useCallback(async (playlistId) => {
    if (!token) {
      const mockPlaylist = getMockPlaylist(playlistId);
      if (mockPlaylist) {
        setCurrentPlaylist(mockPlaylist);
        setSearchResults(null);
        toast({ title: `Now Viewing: ${mockPlaylist.name}` });
      } else {
        toast({ title: "Playlist not found", variant: "destructive" });
      }
      return;
    }

    try {
      const playlist = await spotifyApi.getPlaylist(token, playlistId);
      if (playlist.tracks.items.some(item => !item.track || !item.track.album)) {
        const tracksData = await spotifyApi.getPlaylistTracks(token, playlistId);
        playlist.tracks = tracksData;
      }
      setCurrentPlaylist(playlist);
      setSearchResults(null);
      toast({
        title: `Now Viewing: ${playlist.name}`,
        description: playlist.description || "Enjoy the tunes!",
      });
    } catch (error) {
      toast({ title: "Error fetching playlist", description: error.message, variant: "destructive" });
    }
  }, [token, toast]);

  const handleSearch = useCallback(async (query) => {
    if (!query || !query.trim()) {
      setSearchResults(null);
      return;
    }
    if (!token) {
      const mockResults = getMockData("searchTracks")(query); // Assuming mockSearch is getMockData("searchTracks")
      setSearchResults(mockResults);
      toast({ title: "Search Results (Mock Data)" });
      return;
    }

    try {
      const results = await spotifyApi.search(token, query, ['track', 'artist', 'album', 'playlist'], 20);
      setSearchResults(results);
      toast({
        title: results.tracks?.items?.length > 0 ? "Search Results" : "No Matches Found",
        description: `Showing results for "${query}"`,
      });
    } catch (error) {
      toast({ title: "Search Error", description: error.message, variant: "destructive" });
    }
  }, [token, toast]);
  

  return {
    playlists,
    newReleases,
    featuredPlaylists,
    categories,
    currentPlaylist,
    searchResults,
    fetchInitialData,
    handlePlaylistSelect,
    handleSearch,
    setCurrentPlaylist,
    setSearchResults,
  };
};
