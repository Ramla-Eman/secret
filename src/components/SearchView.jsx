
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Play, Search, Compass, Music, Mic2, Disc3, Loader2 } from "lucide-react";

const SearchView = ({ searchResults, onPlayTrack, categories, isLoggedIn, isLoading }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", damping: 15, stiffness: 100 } },
    hover: { scale: 1.03, y: -3, transition: { type: "spring", stiffness: 300 } },
    tap: { scale: 0.97 }
  };

  const CategoryCard = ({ category }) => (
    <motion.div
      variants={itemVariants}
      whileHover="hover"
      whileTap="tap"
      className="relative overflow-hidden rounded-xl aspect-[16/10] group cursor-pointer shadow-lg hover:shadow-primary/30 border border-border/30 backdrop-blur-sm"
    >
      <img 
        alt={category.name}
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
       src="https://images.unsplash.com/photo-1632065509860-4fbcfc89ed7c" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-4">
        <h3 className="text-xl font-bold text-white drop-shadow-lg">{category.name}</h3>
      </div>
    </motion.div>
  );

  const SearchResultItem = ({ item, type, onPlay }) => {
    const imageSrc = item.album?.images?.[0]?.url || item.images?.[0]?.url || "https://source.unsplash.com/random/100x100?music-abstract";
    const title = item.name;
    let subtitle;
    if (type === 'track') subtitle = item.artists?.map(artist => artist.name).join(", ");
    else if (type === 'album') subtitle = item.artists?.map(artist => artist.name).join(", ");
    else if (type === 'artist') subtitle = item.genres?.slice(0,2).join(", ") || "Artist";
    
    return (
      <motion.div
        variants={itemVariants}
        whileHover="hover"
        whileTap="tap"
        className="flex items-center p-3.5 rounded-lg hover:bg-card/80 group cursor-pointer transition-colors duration-150 border border-transparent hover:border-primary/30"
        onClick={() => type === 'track' && onPlay(item)}
      >
        <div className="relative mr-4 flex-shrink-0 w-16 h-16 rounded-md overflow-hidden shadow-sm">
          <img 
            alt={title}
            class="w-full h-full object-cover"
           src="https://images.unsplash.com/photo-1694388001616-1176f534d72f" />
          {type === 'track' && (
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
              <Play className="h-8 w-8 text-primary neon-glow-primary" />
            </div>
          )}
        </div>
        <div className="overflow-hidden">
          <div className="font-semibold text-foreground truncate text-base">{title}</div>
          {subtitle && <div className="text-sm text-muted-foreground truncate">{subtitle}</div>}
          {type === 'track' && item.album?.name && <div className="text-xs text-muted-foreground/70 truncate">{item.album.name}</div>}
        </div>
      </motion.div>
    );
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center">
        <Loader2 className="h-16 w-16 text-primary animate-spin mb-6" />
        <p className="text-lg text-muted-foreground">Searching the cosmos for your tunes...</p>
      </div>
    );
  }

  const noResults = !searchResults || 
                    (!searchResults.tracks?.items?.length && 
                     !searchResults.artists?.items?.length && 
                     !searchResults.albums?.items?.length);

  return (
    <div className="p-6 md:p-8 pb-32">
      {!searchResults && categories && categories.length > 0 ? (
         <>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-6 text-foreground flex items-center"
          >
            <Compass className="mr-3 h-8 w-8 text-primary" /> Browse All
          </motion.h1>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6"
          >
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </motion.div>
        </>
      ) : noResults && !isLoading ? (
         <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center"
        >
          <Search className="h-24 w-24 text-primary/40 mb-6" />
          <h2 className="text-3xl font-bold text-foreground mb-2">Nothing Found Here</h2>
          <p className="text-lg text-muted-foreground max-w-md">
            We couldn't find any matches for your search. Try a different keyword or explore categories.
          </p>
        </motion.div>
      ) : (
        <>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-1 text-foreground"
          >
            Search Results
          </motion.h1>
          <p className="text-muted-foreground mb-6">
            Displaying results for your query.
          </p>
          
          <Tabs defaultValue="songs" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6 bg-card/80 p-1.5 rounded-lg border border-border/50">
              <TabsTrigger value="songs" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"><Music className="h-4 w-4"/>Songs</TabsTrigger>
              <TabsTrigger value="artists" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"><Mic2 className="h-4 w-4"/>Artists</TabsTrigger>
              <TabsTrigger value="albums" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"><Disc3 className="h-4 w-4"/>Albums</TabsTrigger>
              <TabsTrigger value="playlists" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"><Compass className="h-4 w-4"/>Playlists</TabsTrigger>
            </TabsList>

            <TabsContent value="songs">
              {searchResults?.tracks?.items?.length > 0 ? (
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-3">
                  {searchResults.tracks.items.map((track) => (
                    <SearchResultItem key={track.id} item={track} type="track" onPlay={onPlayTrack} />
                  ))}
                </motion.div>
              ) : <div className="text-center py-10 text-muted-foreground">No songs found.</div>}
            </TabsContent>
            <TabsContent value="artists">
              {searchResults?.artists?.items?.length > 0 ? (
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-3">
                  {searchResults.artists.items.map((artist) => (
                    <SearchResultItem key={artist.id} item={artist} type="artist" />
                  ))}
                </motion.div>
              ) : <div className="text-center py-10 text-muted-foreground">No artists found.</div>}
            </TabsContent>
            <TabsContent value="albums">
              {searchResults?.albums?.items?.length > 0 ? (
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-3">
                  {searchResults.albums.items.map((album) => (
                    <SearchResultItem key={album.id} item={album} type="album" />
                  ))}
                </motion.div>
              ) : <div className="text-center py-10 text-muted-foreground">No albums found.</div>}
            </TabsContent>
             <TabsContent value="playlists">
              {searchResults?.playlists?.items?.length > 0 ? (
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-3">
                  {searchResults.playlists.items.map((playlist) => (
                    <SearchResultItem key={playlist.id} item={playlist} type="playlist" />
                  ))}
                </motion.div>
              ) : <div className="text-center py-10 text-muted-foreground">No playlists found.</div>}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default SearchView;
