
import { SPOTIFY_API_BASE_URL } from './spotifyConfig';

const callSpotifyApi = async (endpoint, token, method = 'GET', body = null) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${SPOTIFY_API_BASE_URL}/${endpoint}`, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
      console.error(`Spotify API Error (${response.status}): ${errorData.error?.message || response.statusText}`, errorData);
      throw new Error(`Spotify API Error: ${errorData.error?.message || response.statusText}`);
    }
    if (response.status === 204 || response.headers.get("content-length") === "0") {
      return null; 
    }
    return await response.json();
  } catch (error) {
    console.error('Error calling Spotify API:', error);
    throw error;
  }
};

export const getMyProfile = (token) => callSpotifyApi('me', token);
export const getMyPlaylists = (token, limit = 20) => callSpotifyApi(`me/playlists?limit=${limit}`, token);
export const getPlaylist = (token, playlistId) => callSpotifyApi(`playlists/${playlistId}`, token);
export const getPlaylistTracks = (token, playlistId, limit = 50) => callSpotifyApi(`playlists/${playlistId}/tracks?limit=${limit}`, token);

export const getFeaturedPlaylists = (token, limit = 20) => callSpotifyApi(`browse/featured-playlists?limit=${limit}`, token);
export const getNewReleases = (token, limit = 20) => callSpotifyApi(`browse/new-releases?limit=${limit}`, token);
export const getCategories = (token, limit = 20) => callSpotifyApi(`browse/categories?limit=${limit}`, token);
export const getCategoryPlaylists = (token, categoryId, limit = 20) => callSpotifyApi(`browse/categories/${categoryId}/playlists?limit=${limit}`, token);

export const search = (token, query, types = ['track', 'artist', 'album'], limit = 10) => {
  const typeString = types.join(',');
  return callSpotifyApi(`search?q=${encodeURIComponent(query)}&type=${typeString}&limit=${limit}`, token);
};

export const getTrack = (token, trackId) => callSpotifyApi(`tracks/${trackId}`, token);
export const getAlbum = (token, albumId) => callSpotifyApi(`albums/${albumId}`, token);
export const getArtist = (token, artistId) => callSpotifyApi(`artists/${artistId}`, token);

// Playback control (requires active device and premium for some features)
export const playTrack = (token, deviceId, uris, offset = null) => {
  const body = { uris };
  if (offset) body.offset = offset;
  let endpoint = `me/player/play`;
  if (deviceId) endpoint += `?device_id=${deviceId}`;
  return callSpotifyApi(endpoint, token, 'PUT', body);
};

export const pausePlayback = (token, deviceId) => {
  let endpoint = `me/player/pause`;
  if (deviceId) endpoint += `?device_id=${deviceId}`;
  return callSpotifyApi(endpoint, token, 'PUT');
};

export const nextTrack = (token, deviceId) => {
  let endpoint = `me/player/next`;
  if (deviceId) endpoint += `?device_id=${deviceId}`;
  return callSpotifyApi(endpoint, token, 'POST');
};

export const previousTrack = (token, deviceId) => {
  let endpoint = `me/player/previous`;
  if (deviceId) endpoint += `?device_id=${deviceId}`;
  return callSpotifyApi(endpoint, token, 'POST');
};

export const setRepeatMode = (token, state, deviceId) => {
  // state can be 'track', 'context', or 'off'
  let endpoint = `me/player/repeat?state=${state}`;
  if (deviceId) endpoint += `&device_id=${deviceId}`;
  return callSpotifyApi(endpoint, token, 'PUT');
};

export const setShuffleMode = (token, state, deviceId) => {
  // state is boolean
  let endpoint = `me/player/shuffle?state=${state}`;
  if (deviceId) endpoint += `&device_id=${deviceId}`;
  return callSpotifyApi(endpoint, token, 'PUT');
};

export const setVolume = (token, volumePercent, deviceId) => {
  let endpoint = `me/player/volume?volume_percent=${volumePercent}`;
  if (deviceId) endpoint += `&device_id=${deviceId}`;
  return callSpotifyApi(endpoint, token, 'PUT');
};

export const getAvailableDevices = (token) => callSpotifyApi('me/player/devices', token);
export const transferPlayback = (token, deviceIds, play = true) => {
  // deviceIds should be an array with a single device ID string
  return callSpotifyApi('me/player', token, 'PUT', { device_ids: deviceIds, play });
};
