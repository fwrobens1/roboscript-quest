import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Play, ArrowRight, TrendingUp, Users, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export default function Home() {
  const [recentScripts, setRecentScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRecentScripts();
  }, []);

  const fetchRecentScripts = async () => {
    try {
      const { data, error } = await supabase
        .from('scripts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        toast({
          title: "Error loading scripts",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setRecentScripts(data || []);
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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        <div className="absolute inset-0 opacity-30 animate-float">
          <div className="w-full h-full bg-gradient-gaming/10"></div>
        </div>
        
        <div className="container mx-auto px-4 py-20 lg:py-32 relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Trust Badge */}
            <div className="inline-flex items-center space-x-2 bg-gaming-success/10 border border-gaming-success/20 rounded-full px-4 py-2 mb-8">
              <div className="w-2 h-2 bg-gaming-success rounded-full animate-pulse"></div>
              <span className="text-sm text-gaming-success font-medium">
                Trusted by 100K+ Roblox players
              </span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Get the Best{" "}
              <span className="bg-gradient-gaming bg-clip-text text-transparent">
                Roblox Scripts
              </span>
              !
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Find free and working scripts for your favorite Roblox games like{" "}
              <span className="text-primary font-medium">Blox Fruits</span>,{" "}
              <span className="text-primary font-medium">Adopt Me</span>,{" "}
              <span className="text-primary font-medium">Arsenal</span>, and thousands more. 
              Updated daily by our community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button asChild variant="hero" size="lg" className="min-w-48">
                <Link to="/scripts">
                  <Play className="w-5 h-5 mr-2" />
                  Explore Scripts
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="min-w-48">
                <Link to="/popular">
                  Browse by Game
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">1000+</div>
                <div className="text-sm text-muted-foreground">Active Scripts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">50K+</div>
                <div className="text-sm text-muted-foreground">Daily Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Scripts Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Recent Scripts</h2>
              <p className="text-muted-foreground">Latest scripts uploaded by our community</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/scripts">
                View All Scripts
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-card/50 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : recentScripts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentScripts.map((script) => (
                <ScriptCard key={script.id} script={script} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-xl font-semibold mb-2">No scripts yet</h3>
              <p className="text-muted-foreground">Be the first to upload a script!</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose RoboScript Quest?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The most trusted platform for Roblox scripts with advanced features and community-driven content.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-gradient-card border border-border/50">
              <div className="w-12 h-12 bg-gaming-success/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-gaming-success" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Always Updated</h3>
              <p className="text-muted-foreground">
                Our scripts are regularly updated to work with the latest Roblox updates and patches.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-gradient-card border border-border/50">
              <div className="w-12 h-12 bg-gaming-blue/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-gaming-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Community Driven</h3>
              <p className="text-muted-foreground">
                Built by the community, for the community. Rate and review scripts to help others.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-gradient-card border border-border/50">
              <div className="w-12 h-12 bg-gaming-purple/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-gaming-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy to Use</h3>
              <p className="text-muted-foreground">
                One-click copy and paste. No complicated setup or installation required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-gaming relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Level Up Your Roblox Experience?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of players who trust RoboScript Quest for their scripting needs.
            </p>
            <Button asChild variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link to="/scripts">
                Start Exploring Scripts
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}