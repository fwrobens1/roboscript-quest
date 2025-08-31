import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  user_id: string;
  username?: string;
  avatar_url?: string;
  is_admin?: boolean;
}

export function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer profile fetching
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/scripts?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">RS</span>
          </div>
          <span className="text-xl font-bold bg-gradient-gaming bg-clip-text text-transparent">
            RoboScript Quest
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className="text-foreground hover:text-primary transition-colors font-medium"
          >
            Home
          </Link>
          <Link 
            to="/scripts" 
            className="text-foreground hover:text-primary transition-colors font-medium"
          >
            Scripts
          </Link>
          <Link 
            to="/popular" 
            className="text-foreground hover:text-primary transition-colors font-medium"
          >
            Popular
          </Link>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden lg:block flex-1 max-w-md mx-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search scripts, games, or features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/50 border-border"
            />
          </div>
        </form>

        {/* User Actions */}
        <div className="flex items-center space-x-3">
          {user ? (
            <>
              {profile?.is_admin && (
                <Button variant="gaming" size="sm" asChild>
                  <Link to="/upload">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Script
                  </Link>
                </Button>
              )}
              <div className="flex items-center space-x-2">
                <span className="hidden sm:inline text-sm text-muted-foreground">
                  {profile?.username || user.email}
                </span>
                <Button variant="ghost" size="icon" onClick={handleSignOut}>
                  <User className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <Button variant="hero" asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}