
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Home, 
  Search, 
  Library, 
  PlusCircle, 
  Heart, 
  Settings,
  LogIn,
  LogOut,
  Music2,
  User
} from "lucide-react";

const Sidebar = ({ 
  playlists, 
  onPlaylistSelect, 
  onHomeClick, 
  onSearchClick, 
  isLoggedIn, 
  onLogout, 
  loginUrl,
  userProfile
}) => {
  const navItemVariants = {
    initial: { opacity: 0, x: -25 },
    animate: { opacity: 1, x: 0 },
    hover: { scale: 1.05, color: "hsl(var(--primary))", x: 5 },
    tap: { scale: 0.95 }
  };

  const NavButton = ({ icon: Icon, label, onClickAction, disabled = false }) => (
    <motion.div variants={navItemVariants} whileHover={!disabled ? "hover" : ""} whileTap={!disabled ? "tap" : ""}>
      <Button 
        variant="ghost" 
        className="w-full justify-start text-muted-foreground hover:text-primary py-3 text-base font-medium transition-all duration-200 ease-out group"
        onClick={onClickAction}
        disabled={disabled}
      >
        <Icon className="mr-4 h-6 w-6 transition-transform duration-300 group-hover:rotate-[-5deg] group-hover:scale-110" />
        {label}
      </Button>
    </motion.div>
  );

  return (
    <motion.div 
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.1 }}
      className="w-64 bg-card/80 backdrop-blur-xl h-screen flex flex-col p-6 fixed left-0 top-0 z-40 shadow-2xl border-r border-border"
    >
      <div className="mb-10 flex items-center space-x-3">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1, 1.1, 1]}}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
        >
          <Music2 className="h-10 w-10 text-primary neon-glow-primary rounded-full p-1 bg-primary/10" />
        </motion.div>
        <h1 className="text-3xl font-bold animated-gradient-text">
          AuraBeat
        </h1>
      </div>
      
      <motion.div 
        className="space-y-2 mb-6"
        variants={{ animate: { transition: { staggerChildren: 0.07 }}}}
        initial="initial"
        animate="animate"
      >
        <NavButton icon={Home} label="Home" onClickAction={onHomeClick} />
        <NavButton icon={Search} label="Search" onClickAction={onSearchClick} />
        <NavButton icon={Library} label="Your Library" disabled={!isLoggedIn} />
      </motion.div>
      
      <motion.div 
        className="space-y-2 mb-6"
        variants={{ animate: { transition: { staggerChildren: 0.07, delayChildren: 0.21 }}}}
        initial="initial"
        animate="animate"
      >
        <NavButton icon={PlusCircle} label="Create Playlist" disabled={!isLoggedIn} />
        <NavButton icon={Heart} label="Liked Songs" disabled={!isLoggedIn} />
      </motion.div>
      
      <div className="border-t border-border/70 mt-4 pt-4 flex-1 overflow-y-auto scrollbar-hide">
        <h3 className="text-xs font-semibold text-muted-foreground/80 mb-3 px-2 tracking-wider uppercase">PLAYLISTS</h3>
        <motion.div 
          className="space-y-0.5"
          variants={{ animate: { transition: { staggerChildren: 0.04, delayChildren: 0.4 }}}}
          initial="initial"
          animate="animate"
        >
          {playlists.slice(0, 15).map((playlist) => ( // Limit displayed playlists
            <motion.div key={playlist.id} variants={navItemVariants} whileHover="hover" whileTap="tap">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-muted-foreground hover:text-primary text-sm font-normal h-9 px-2 truncate"
                onClick={() => onPlaylistSelect(playlist.id)}
                disabled={!isLoggedIn && !playlist.public} // Example: disable private mock playlists if not logged in
              >
                {playlist.name}
              </Button>
            </motion.div>
          ))}
          {playlists.length === 0 && isLoggedIn && <p className="text-xs text-muted-foreground px-2">No playlists found.</p>}
          {playlists.length === 0 && !isLoggedIn && <p className="text-xs text-muted-foreground px-2">Login to see your playlists.</p>}
        </motion.div>
      </div>
      
      <motion.div 
        className="mt-auto border-t border-border/70 pt-5 space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {isLoggedIn && userProfile && (
          <div className="flex items-center space-x-3 p-2 rounded-lg bg-muted/30">
            <Avatar className="h-9 w-9 border-2 border-secondary">
              <AvatarImage src={userProfile.images?.[0]?.url} alt={userProfile.display_name} />
              <AvatarFallback className="bg-secondary/50 text-secondary-foreground">
                {userProfile.display_name?.[0]?.toUpperCase() || <User />}
              </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-foreground truncate">{userProfile.display_name}</p>
              <p className="text-xs text-muted-foreground truncate">{userProfile.email}</p>
            </div>
          </div>
        )}
        {isLoggedIn ? (
          <Button 
            variant="outline" 
            className="w-full justify-center border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300 ease-in-out group"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-5 w-5 group-hover:animate-pulse" />
            Logout
          </Button>
        ) : (
          <a href={loginUrl} className="block">
            <Button 
              variant="default" 
              className="w-full justify-center bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 ease-in-out group neon-glow-primary"
            >
              <LogIn className="mr-2 h-5 w-5 group-hover:animate-pulse" />
              Login with Spotify
            </Button>
          </a>
        )}
        <NavButton icon={Settings} label="Settings" />
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;
