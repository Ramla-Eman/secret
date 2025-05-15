
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ChevronLeft, 
  ChevronRight, 
  Bell, 
  User,
  Search,
  X,
  LogIn,
  LogOut
} from "lucide-react";

const TopBar = ({ onSearch, isLoggedIn, userProfile, loginUrl, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };
  
  return (
    <motion.div 
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 90, damping: 18, delay:0.2 }}
      className="flex items-center justify-between py-4 px-6 glass-effect sticky top-0 z-20 border-b border-border/70"
      style={{ '--topbar-height': '76px' }}
    >
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/20 transition-colors">
          <ChevronLeft className="h-6 w-6 text-muted-foreground hover:text-primary" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/20 transition-colors">
          <ChevronRight className="h-6 w-6 text-muted-foreground hover:text-primary" />
        </Button>
      </div>
      
      <motion.form 
        className="relative flex-grow max-w-lg mx-4"
        onSubmit={handleSearchSubmit}
        animate={{ scale: isSearchFocused ? 1.03 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 12 }}
      >
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <Search className={`h-5 w-5 transition-colors ${isSearchFocused ? 'text-primary' : 'text-muted-foreground/70'}`} />
        </div>
        <input
          type="text"
          placeholder="Search for songs, artists, albums..."
          className="bg-card/60 text-foreground placeholder-muted-foreground/80 rounded-full pl-11 pr-10 py-3 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:bg-card transition-all duration-300 text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
        />
        {searchQuery && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-muted/50 transition-colors"
            onClick={() => {
              setSearchQuery("");
              onSearch(""); 
            }}
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </motion.form>
      
      <div className="flex items-center space-x-3">
        {!isLoggedIn && (
          <a href={loginUrl}>
            <Button variant="outline" className="rounded-full text-sm font-medium border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors group">
              <LogIn className="mr-2 h-4 w-4 group-hover:animate-bounce-sm" /> Login
            </Button>
          </a>
        )}

        {isLoggedIn && (
          <>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/20 transition-colors">
              <Bell className="h-5 w-5 text-muted-foreground hover:text-primary" />
            </Button>
            
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Avatar className="h-9 w-9 border-2 border-secondary hover:border-primary transition-colors cursor-pointer" onClick={onLogout}>
                <AvatarImage src={userProfile?.images?.[0]?.url} alt={userProfile?.display_name} />
                <AvatarFallback className="bg-accent/40 text-accent-foreground">
                  {userProfile?.display_name?.[0]?.toUpperCase() || <User className="h-5 w-5" />}
                </AvatarFallback>
              </Avatar>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default TopBar;
