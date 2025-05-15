
import React from 'react';
import HomePage from "@/components/HomePage";
import PlaylistView from "@/components/PlaylistView";
import SearchView from "@/components/SearchView";
import { getMockData } from "@/lib/spotify";


const MainContent = ({
  view,
  newReleases,
  featuredPlaylists,
  categories,
  onPlayTrack,
  onPlaylistSelect,
  isLoggedIn,
  currentPlaylist,
  searchResults,
  token,
}) => {
  switch (view) {
    case "home":
      return (
        <HomePage 
          newReleases={newReleases}
          featuredPlaylists={featuredPlaylists}
          categories={categories}
          onPlayTrack={onPlayTrack}
          onPlaylistSelect={onPlaylistSelect}
          isLoggedIn={isLoggedIn}
        />
      );
    case "playlist":
      return currentPlaylist ? (
        <PlaylistView 
          playlist={currentPlaylist}
          onPlayTrack={onPlayTrack}
          isLoggedIn={isLoggedIn}
        />
      ) : <div className="p-8 text-center">Select a playlist to view.</div>;
    case "search":
      return (
        <SearchView 
          searchResults={searchResults}
          onPlayTrack={onPlayTrack}
          categories={token ? categories : getMockData("categories")}
          isLoggedIn={isLoggedIn}
          isLoading={!searchResults && token && view === 'search'}
        />
      );
    default:
      return <div className="p-8 text-center">Page not found.</div>;
  }
};

export default MainContent;
