
import { useState, useCallback } from 'react';

export const useNavigation = (setSearchResultsFn, setCurrentPlaylistFn, token, searchResults) => {
  const [view, setView] = useState("home");

  const navigateTo = useCallback((targetView) => {
    setView(targetView);
    if (targetView === "home") {
      setSearchResultsFn(null);
      setCurrentPlaylistFn(null);
    } else if (targetView === "search") {
      setCurrentPlaylistFn(null);
      if (!searchResults && !token) {
        setSearchResultsFn({ tracks: { items: [] } }); // Ensure search view has a base state for mock
      } else if (!searchResults && token) {
         setSearchResultsFn(null); // Allow API search to show initial categories or empty state
      }
    } else if (targetView === "playlist") {
        setSearchResultsFn(null);
    }
  }, [setSearchResultsFn, setCurrentPlaylistFn, token, searchResults]);

  return { view, navigateTo };
};
