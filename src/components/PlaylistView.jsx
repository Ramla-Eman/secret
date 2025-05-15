
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Clock, MoreHorizontal, Heart, Music, Users, CalendarDays, ListFilter } from "lucide-react";

const formatDuration = (ms) => {
  if (!ms && ms !== 0) return "-:--";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const PlaylistView = ({ playlist, onPlayTrack, isLoggedIn }) => {
  if (!playlist) return <div className="p-8 text-center text-muted-foreground">Loading playlist...</div>;
  
  const headerVariants = {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 18, stiffness: 90, delay: 0.1 } }
  };

  const controlsVariants = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1, transition: { delay: 0.3, duration: 0.4, ease: "easeOut" } }
  };

  const trackItemVariants = (index) => ({
    hidden: { opacity: 0, x: -25 },
    visible: { opacity: 1, x: 0, transition: { delay: 0.4 + index * 0.03, duration: 0.3, ease: "easeOut" } }
  });

  const tracks = playlist.tracks?.items || [];

  return (
    <div className="pb-32">
      <motion.div 
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col md:flex-row items-center md:items-end p-6 md:p-8 bg-gradient-to-br from-primary/25 via-background/80 to-background/80 backdrop-blur-sm"
      >
        <div className="w-48 h-48 md:w-60 md:h-60 flex-shrink-0 mb-6 md:mb-0 md:mr-8 rounded-xl overflow-hidden shadow-2xl border-2 border-primary/30">
          <img 
            alt={playlist.name}
            class="w-full h-full object-cover"
           src="https://images.unsplash.com/photo-1594413026474-2e2103093b82" />
        </div>
        
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <p className="text-sm uppercase font-semibold text-primary mb-1 tracking-wider">{playlist.type || "Playlist"}</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">{playlist.name}</h1>
          {playlist.description && <p className="text-base text-muted-foreground mb-3 max-w-xl" dangerouslySetInnerHTML={{ __html: playlist.description }}></p>}
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {playlist.owner && <span className="flex items-center"><Users className="w-4 h-4 mr-1.5 text-secondary"/> {playlist.owner.display_name}</span>}
            <span className="flex items-center"><Music className="w-4 h-4 mr-1.5 text-secondary"/> {tracks.length} songs</span>
            {playlist.followers?.total && <span className="flex items-center"><Heart className="w-4 h-4 mr-1.5 text-secondary"/> {playlist.followers.total.toLocaleString()} likes</span>}
            {playlist.release_date && <span className="flex items-center"><CalendarDays className="w-4 h-4 mr-1.5 text-secondary"/> {playlist.release_date}</span>}
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        variants={controlsVariants}
        initial="hidden"
        animate="visible"
        className="px-6 md:px-8 py-5 flex items-center space-x-4 sticky top-[var(--topbar-height,76px)] bg-background/90 backdrop-blur-md z-10 border-b border-border/50"
      >
        <Button 
          variant="default" 
          size="lg" 
          className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg neon-glow-primary px-7 py-3 text-base"
          onClick={() => tracks.length > 0 && onPlayTrack(tracks[0]?.track)}
          disabled={tracks.length === 0}
        >
          <Play className="h-6 w-6 mr-2.5 -ml-1" />
          Play
        </Button>
        
        <Button variant="outline" size="icon" className="rounded-full border-accent text-accent hover:bg-accent/10 hover:text-accent transition-colors">
          <Heart className="h-5 w-5" />
        </Button>
        
        <Button variant="outline" size="icon" className="rounded-full border-secondary text-secondary hover:bg-secondary/10 hover:text-secondary transition-colors">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
        <div className="flex-grow"></div>
        <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary transition-colors">
          <ListFilter className="h-5 w-5" />
        </Button>
      </motion.div>
      
      <div className="px-6 md:px-8 mt-2">
        <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_minmax(250px,2fr)_minmax(150px,1fr)_auto] gap-x-4 items-center text-xs text-muted-foreground/80 border-b border-border/50 pb-2 mb-3 font-medium uppercase tracking-wider">
          <span className="text-center w-8">#</span>
          <span>Title</span>
          <span className="hidden md:block">Album</span>
          <span className="text-right pr-2"><Clock className="h-4 w-4 inline" /></span>
        </div>
        <ul>
          {tracks.map((item, index) => {
            const track = item.track || item; // Handle cases where track is nested or direct
            if (!track || !track.id) return null; // Skip if track data is incomplete
            return (
              <motion.li 
                key={`${track.id}-${index}`} // Ensure unique key if track IDs can repeat across different API responses
                variants={trackItemVariants(index)}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_minmax(250px,2fr)_minmax(150px,1fr)_auto] gap-x-4 items-center p-2.5 rounded-lg hover:bg-card/80 group cursor-pointer transition-colors duration-150"
                onClick={() => onPlayTrack(track)}
              >
                <div className="text-muted-foreground group-hover:text-primary w-8 text-center font-medium">
                  <span className="group-hover:hidden">{index + 1}</span>
                  <Play className="h-4 w-4 hidden group-hover:block mx-auto text-primary" />
                </div>
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="w-11 h-11 rounded-md overflow-hidden flex-shrink-0 shadow-sm">
                    <img 
                      alt={track.album?.name || track.name}
                      class="w-full h-full object-cover"
                     src="https://images.unsplash.com/photo-1632667113908-10f5dbafa8a1" />
                  </div>
                  <div className="overflow-hidden">
                    <div className={`font-semibold truncate ${track.preview_url || isLoggedIn ? 'text-foreground' : 'text-muted-foreground/70'}`}>{track.name}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {track.artists?.map(artist => artist.name).join(", ")}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground truncate hidden md:block">
                  {track.album?.name}
                </div>
                <div className="text-sm text-muted-foreground text-right pr-2">
                  {formatDuration(track.duration_ms)}
                </div>
              </motion.li>
            );
          })}
          {tracks.length === 0 && <p className="text-center text-muted-foreground py-8">This playlist is currently empty.</p>}
        </ul>
      </div>
    </div>
  );
};

export default PlaylistView;
