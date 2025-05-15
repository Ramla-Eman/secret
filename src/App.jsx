
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import MusicPlayer from "@/components/MusicPlayer";
import MainContent from "@/components/MainContent";
import { useSpotifyAuth } from "@/hooks/useSpotifyAuth";
import { useSpotifyData } from "@/hooks/useSpotifyData";
import { usePlayerControls } from "@/hooks/usePlayerControls";
import { useNavigation } from "@/hooks/useNavigation";
import { loginUrl } from "@/lib/spotify";

function App() {
  const { token, userProfile, handleLogout } = useSpotifyAuth();
  const {
    playlists,
    newReleases,
    featuredPlaylists,
    categories,
    currentPlaylist,
    searchResults,
    fetchInitialData,
    handlePlaylistSelect,
    handleSearch,
    setSearchResults, 
    setCurrentPlaylist,
  } = useSpotifyData(token);

  const {
    currentTrack,
    isShuffle,
    setIsShuffle,
    handlePlayTrack,
    handleNextTrack,
    handlePreviousTrack,
  } = usePlayerControls(token, currentPlaylist, searchResults, playlists, newReleases, featuredPlaylists);
  
  const { view, navigateTo } = useNavigation(setSearchResults, setCurrentPlaylist, token, searchResults);

  return (
    <div className="flex h-screen overflow-hidden text-foreground">
      <div className="aurora-background"></div>
      <Sidebar 
        playlists={playlists} 
        onPlaylistSelect={(playlistId) => {
          handlePlaylistSelect(playlistId);
          navigateTo("playlist");
        }}
        onHomeClick={() => navigateTo("home")}
        onSearchClick={() => navigateTo("search")}
        isLoggedIn={!!token}
        onLogout={handleLogout}
        loginUrl={loginUrl}
        userProfile={userProfile}
      />
      
      <main className="flex-1 overflow-y-auto ml-64 relative bg-transparent">
        <TopBar 
          onSearch={(query) => {
            handleSearch(query);
            if (query.trim()) navigateTo("search");
          }} 
          isLoggedIn={!!token} 
          userProfile={userProfile} 
          loginUrl={loginUrl}
          onLogout={handleLogout}
        />
        
        <div className="pt-[var(--topbar-height, 76px)]">
          <MainContent
            view={view}
            newReleases={newReleases}
            featuredPlaylists={featuredPlaylists}
            categories={categories}
            onPlayTrack={handlePlayTrack}
            onPlaylistSelect={(playlistId) => {
              handlePlaylistSelect(playlistId);
              navigateTo("playlist");
            }}
            isLoggedIn={!!token}
            currentPlaylist={currentPlaylist}
            searchResults={searchResults}
            token={token}
          />
        </div>
      </main>
      
      <MusicPlayer 
        currentTrack={currentTrack}
        onNext={() => handleNextTrack(view)}
        onPrevious={() => handlePreviousTrack(view)}
        isShuffle={isShuffle} 
        setIsShuffle={setIsShuffle}
        token={token}
      />
      
      <Toaster />
    </div>
  );
}

export default App;
