import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, SortAsc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScriptCard } from "@/components/ScriptCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Script {
  id: string;
  title: string;
  description: string;
  thumbnail_url?: string;
  custom_thumbnail_url?: string;
  upvotes: number;
  downvotes: number;
  views: number;
  features: string[];
  tags: string[];
  works_on_mobile: boolean;
  has_keysystem: boolean;
  costs_money: boolean;
  created_at: string;
}

export default function Scripts() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [gameFilter, setGameFilter] = useState("all");
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchScripts();
  }, [searchQuery, sortBy, gameFilter]);

  const fetchScripts = async () => {
    setLoading(true);
    try {
      let query = supabase.from('scripts').select('*');

      // Apply search filter
      if (searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,tags.cs.{${searchQuery}}`);
      }

      // Apply game filter
      if (gameFilter !== "all") {
        query = query.contains('tags', [gameFilter]);
      }

      // Apply sorting
      switch (sortBy) {
        case "newest":
          query = query.order('created_at', { ascending: false });
          break;
        case "popular":
          query = query.order('upvotes', { ascending: false });
          break;
        case "views":
          query = query.order('views', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        toast({
          title: "Error loading scripts",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setScripts(data || []);
    } catch (error) {
      console.error('Error fetching scripts:', error);
      toast({
        title: "Error",
        description: "Failed to load scripts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    } else {
      params.delete("search");
    }
    setSearchParams(params);
  };

  const popularGames = [
    "Blox Fruits",
    "Adopt Me",
    "Arsenal",
    "Murder Mystery 2",
    "Jailbreak",
    "Tower of Hell",
    "Brookhaven",
    "Pet Simulator X"
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Browse Scripts</h1>
          <p className="text-muted-foreground text-lg">
            Discover scripts for your favorite Roblox games
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for scripts, games, or features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card/50 border-border"
              />
            </div>
            <Button type="submit" variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </form>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={gameFilter} onValueChange={setGameFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by game" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Games</SelectItem>
                  {popularGames.map((game) => (
                    <SelectItem key={game} value={game}>
                      {game}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <SortAsc className="h-4 w-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="views">Most Viewed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {loading ? "Loading..." : `Found ${scripts.length} scripts`}
            {searchQuery && ` for "${searchQuery}"`}
            {gameFilter !== "all" && ` in ${gameFilter}`}
          </p>
        </div>

        {/* Scripts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-card/50 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : scripts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {scripts.map((script) => (
              <ScriptCard key={script.id} script={script} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-2xl font-semibold mb-4">No scripts found</h3>
            <p className="text-muted-foreground text-lg mb-6">
              {searchQuery 
                ? `No scripts match your search for "${searchQuery}"`
                : "No scripts available for the selected filters"
              }
            </p>
            {searchQuery && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setSearchParams(new URLSearchParams());
                }}
              >
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}