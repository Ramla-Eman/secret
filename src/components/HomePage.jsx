
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, ListMusic, Radio, Disc3, Star } from "lucide-react";

const HomePage = ({ 
  newReleases, 
  featuredPlaylists, 
  categories, 
  onPlayTrack, 
  onPlaylistSelect,
  isLoggedIn
}) => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.85, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 15, stiffness:100 } },
    hover: { scale: 1.03, y: -5, boxShadow: "0px 12px 25px hsla(var(--primary), 0.2), 0px 5px 10px hsla(var(--primary),0.1)" },
    tap: { scale: 0.97 }
  };

  const Card = ({ item, type, onClickAction }) => {
    const imageSrc = item.images?.[0]?.url || item.icons?.[0]?.url || "https://source.unsplash.com/random/300x300?abstract-music";
    const title = item.name;
    let subtitle;
    if (type === 'album') {
      subtitle = item.artists?.map(artist => artist.name).join(", ") || "Various Artists";
    } else if (type === 'playlist') {
      subtitle = item.description || `${item.tracks?.total || 0} tracks`;
    } else { // category
      subtitle = item.name; // Categories might not have descriptions
    }

    return (
      <motion.div 
        variants={itemVariants}
        whileHover="hover"
        whileTap="tap"
        className="bg-card/70 p-4 rounded-xl shadow-lg hover:shadow-primary/20 transition-all duration-300 group cursor-pointer flex flex-col overflow-hidden backdrop-blur-sm border border-border/30"
        onClick={onClickAction}
      >
        <div className="relative mb-4 aspect-square overflow-hidden rounded-lg shadow-md">
          <img 
            alt={title}
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
           src="https://images.unsplash.com/photo-1565761427976-00b99e567d7f" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-3">
            <Button 
              variant="default" 
              size="icon" 
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl h-11 w-11 neon-glow-primary"
              onClick={(e) => { e.stopPropagation(); onClickAction(); }}
            >
              <Play className="h-5 w-5 ml-0.5" />
            </Button>
          </div>
        </div>
        <h3 className="font-semibold text-md md:text-lg truncate text-foreground mb-1">{title}</h3>
        <p className="text-xs md:text-sm text-muted-foreground truncate flex-grow">{subtitle}</p>
      </motion.div>
    );
  };
  
  const CategoryChip = ({ category, onClickAction }) => (
    <motion.div
      variants={itemVariants}
      whileHover="hover"
      whileTap="tap"
      onClick={onClickAction}
      className="relative overflow-hidden rounded-lg aspect-video group cursor-pointer shadow-md hover:shadow-secondary/30 border border-border/30 backdrop-blur-sm"
    >
      <img 
        alt={category.name}
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
       src="https://images.unsplash.com/photo-1697256200022-f61abccad430" />
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/60 via-accent/40 to-primary/60 opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
      <div className="absolute inset-0 flex items-center justify-center p-3">
        <h3 className="text-lg font-bold text-white text-center drop-shadow-md">{category.name}</h3>
      </div>
    </motion.div>
  );
  
  return (
    <div className="p-6 md:p-8 pb-32 space-y-12">
      <motion.h1 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="text-5xl font-extrabold animated-gradient-text mb-4"
      >
        {getGreeting()}
      </motion.h1>
      
      {!isLoggedIn && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-primary/10 p-6 rounded-xl border border-primary/30 text-center"
        >
          <h2 className="text-2xl font-semibold text-primary mb-2">Unlock the Full Experience!</h2>
          <p className="text-foreground/80 mb-4">Login with Spotify to access your personalized music, playlists, and much more.</p>
          <Button variant="default" size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 neon-glow-primary">
            Login with Spotify
          </Button>
        </motion.div>
      )}

      <motion.section variants={sectionVariants} initial="hidden" animate="visible">
        <SectionHeader title="New Releases" icon={Disc3} />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-6">
          {(newReleases || []).map((album) => (
            <Card key={album.id} item={album} type="album" onClickAction={() => onPlayTrack(album.tracks?.items?.[0]?.track || album)} />
          ))}
        </div>
      </motion.section>
      
      <motion.section variants={sectionVariants} initial="hidden" animate="visible">
        <SectionHeader title="Featured Playlists" icon={Star} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
          {(featuredPlaylists || []).map((playlist) => (
            <Card key={playlist.id} item={playlist} type="playlist" onClickAction={() => onPlaylistSelect(playlist.id)} />
          ))}
        </div>
      </motion.section>
      
      <motion.section variants={sectionVariants} initial="hidden" animate="visible">
        <SectionHeader title="Browse Genres" icon={Radio} />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-6">
          {(categories || []).map((category) => (
            <CategoryChip key={category.id} category={category} onClickAction={() => { /* Implement category click if needed */ }} />
          ))}
        </div>
      </motion.section>
    </div>
  );
};

const SectionHeader = ({ title, icon: Icon }) => (
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-3xl font-bold text-foreground flex items-center">
      {Icon && <Icon className="mr-3 h-7 w-7 text-primary" />}
      {title}
    </h2>
    <Button variant="link" className="text-secondary hover:text-primary transition-colors font-medium">
      Show All
    </Button>
  </div>
);

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 5) return "Late Night Grooves";
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

export default HomePage;
