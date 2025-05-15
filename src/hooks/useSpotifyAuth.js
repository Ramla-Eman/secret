
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { getTokenFromUrl, spotifyApi } from "@/lib/spotify";

export const useSpotifyAuth = () => {
  const [token, setToken] = useState(localStorage.getItem("spotifyToken") || null);
  const [userProfile, setUserProfile] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const hash = getTokenFromUrl();
    window.location.hash = ""; 
    const _token = hash.access_token;

    if (_token) {
      setToken(_token);
      localStorage.setItem("spotifyToken", _token);
      toast({ title: "Logged in to Spotify!", description: "Fetching your music data..." });
    }
  }, [toast]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token && !userProfile) {
        try {
          const profile = await spotifyApi.getMyProfile(token);
          setUserProfile(profile);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          if (error.message.includes("401") || error.message.includes("token expired")) {
            handleLogout(false); // Don't show logout toast if it's an auth error
            toast({
              title: "Session Expired",
              description: "Please log in again.",
              variant: "destructive",
            });
          }
        }
      }
    };
    fetchUserProfile();
  }, [token, userProfile, toast]);

  const handleLogout = useCallback((showToast = true) => {
    setToken(null);
    setUserProfile(null);
    localStorage.removeItem("spotifyToken");
    if (showToast) {
      toast({ title: "Logged Out", description: "See you next time!" });
    }
  }, [toast]);

  return { token, userProfile, handleLogout, setToken };
};
