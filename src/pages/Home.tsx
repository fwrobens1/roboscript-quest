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
  const [recentScripts, setRecentScripts] = useState<Script[]>([
    // Mock data to show script card design
    {
      id: "1",
      title: "Blox Fruits Auto Farm",
      description: "Advanced auto farming script with multiple features including fruit collection, level grinding, and boss farming capabilities.",
      thumbnail_url: "",
      custom_thumbnail_url: "",
      upvotes: 1234,
      downvotes: 45,
      views: 15678,
      features: ["Auto Farm", "Boss Farm", "Fruit Farm"],
      tags: ["Blox Fruits", "Farming"],
      works_on_mobile: true,
      has_keysystem: false,
      costs_money: false,
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "2",
      title: "Arsenal Aimbot",
      description: "Precise aimbot script for Arsenal with customizable settings and ESP features.",
      thumbnail_url: "",
      custom_thumbnail_url: "",
      upvotes: 892,
      downvotes: 23,
      views: 12456,
      features: ["Aimbot", "ESP", "Silent Aim"],
      tags: ["Arsenal", "Combat"],
      works_on_mobile: false,
      has_keysystem: true,
      costs_money: false,
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: "3",
      title: "Adopt Me Auto Trade",
      description: "Automated trading system for Adopt Me with profit calculations and scam protection.",
      thumbnail_url: "",
      custom_thumbnail_url: "",
      upvotes: 567,
      downvotes: 12,
      views: 8934,
      features: ["Auto Trade", "Profit Calc", "Scam Protection"],
      tags: ["Adopt Me", "Trading"],
      works_on_mobile: true,
      has_keysystem: false,
      costs_money: true,
      created_at: new Date(Date.now() - 10800000).toISOString(),
    }
  ]);
  const [loading, setLoading] = useState(false);
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
        console.error('Error loading scripts:', error);
        return;
      }

      if (data && data.length > 0) {
        setRecentScripts(data);
      }
    } catch (error) {
      console.error('Error fetching scripts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] overflow-hidden bg-gradient-hero flex items-center">
        {/* Glowing vertical line effect */}
        <div className="absolute right-1/4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary to-transparent opacity-50"></div>
        <div className="absolute right-1/4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-primary/30 to-transparent blur-sm"></div>
        <div className="absolute right-1/4 top-0 bottom-0 w-[4px] bg-gradient-to-b from-transparent via-primary/10 to-transparent blur-md"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            {/* Trust Badge */}
            <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm text-primary font-medium">
                Trusted by 100K+ Roblox players
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Your Scripts, Your{" "}
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Way
              </span>
            </h1>

            <h2 className="text-xl lg:text-2xl font-medium mb-8 text-muted-foreground max-w-2xl">
              The Ultimate Roblox Script Platform
            </h2>

            <p className="text-base text-muted-foreground mb-10 max-w-2xl leading-relaxed">
              Discover premium scripts, enhance your gameplay, and join the ultimate Roblox scripting community with thousands of verified scripts.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3" asChild>
                <Link to="/scripts">Browse Scripts</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-border hover:bg-accent px-8 py-3" asChild>
                <Link to="/dashboard">Try our demo</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl">
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
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-6">
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
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose RoboScript Quest?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The most trusted platform for Roblox scripts with advanced features and community-driven content.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-card border border-border/50">
              <div className="w-12 h-12 bg-gaming-success/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-gaming-success" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Always Updated</h3>
              <p className="text-muted-foreground">
                Our scripts are regularly updated to work with the latest Roblox updates and patches.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-card border border-border/50">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Community Driven</h3>
              <p className="text-muted-foreground">
                Built by the community, for the community. Rate and review scripts to help others.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-card border border-border/50">
              <div className="w-12 h-12 bg-gaming-warning/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-gaming-warning" />
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
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="container mx-auto px-6 relative">
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