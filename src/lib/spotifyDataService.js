
import { 
  mockPlaylists, 
  mockTracks, 
  mockNewReleases, 
  mockCategories, 
  mockFeaturedPlaylists 
} from './spotifyMockData';

export const getData = (type) => {
  switch (type) {
    case "playlists":
      return mockPlaylists;
    case "tracks":
      return mockTracks;
    case "new-releases":
      return mockNewReleases;
    case "categories":
      return mockCategories;
    case "featured-playlists":
      return mockFeaturedPlaylists;
    default:
      return [];
  }
};

export const getTrackById = (id) => {
  const track = mockTracks.find((t) => t.id === id);
  if (track) return track;
  // Fallback to the first track if ID not found or no ID provided
  return mockTracks.length > 0 ? mockTracks[0] : null;
};

export const getPlaylistById = (id) => {
  const playlist = mockPlaylists.find((p) => p.id === id);
  const fallbackPlaylist = mockPlaylists.length > 0 ? mockPlaylists[0] : null;
  
  const selectedPlaylist = playlist || fallbackPlaylist;

  if (!selectedPlaylist) return null;

  // Ensure all playlists have a consistent track structure, even if empty
  const tracksWithData = mockTracks.length > 0 ? mockTracks.map(track => ({ track })) : [];
  
  return {
    ...selectedPlaylist,
    tracks: { 
      items: selectedPlaylist.tracks?.items || tracksWithData, // Use existing items or fallback
      total: selectedPlaylist.tracks?.total || (selectedPlaylist.tracks?.items?.length || tracksWithData.length)
    }
  };
};

export const searchTracks = (query) => {
  if (!query || typeof query !== 'string') {
    return { tracks: { items: [] }, artists: { items: [] }, albums: { items: [] } };
  }
  
  const lowerQuery = query.toLowerCase();
  const filteredTracks = mockTracks.filter(track => 
    track.name.toLowerCase().includes(lowerQuery) || 
    track.artists.some(artist => artist.name.toLowerCase().includes(lowerQuery))
  );
  
  return {
    tracks: { items: filteredTracks },
    artists: { items: [] }, 
    albums: { items: [] }
  };
};
