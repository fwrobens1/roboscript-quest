import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Copy, 
  Heart, 
  HeartOff, 
  Eye, 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  Flag,
  ArrowLeft,
  Shield,
  Smartphone,
  DollarSign,
  Key,
  Calendar,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Script {
  id: string;
  title: string;
  description: string;
  script_content: string;
  script_link?: string;
  game_link?: string;
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
  created_by: string;
}

interface UserVote {
  vote_type: "upvote" | "downvote";
}

export default function ScriptDetail() {
  const { id } = useParams<{ id: string }>();
  const [script, setScript] = useState<Script | null>(null);
  const [userVote, setUserVote] = useState<UserVote | null>(null);
  const [loading, setLoading] = useState(true);
  const [copying, setCopying] = useState(false);
  const [voting, setVoting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchScript();
      incrementViews();
      checkUserVote();
    }
  }, [id]);

  const fetchScript = async () => {
    try {
      const { data, error } = await supabase
        .from('scripts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        toast({
          title: "Error loading script",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setScript(data);
    } catch (error) {
      console.error('Error fetching script:', error);
      toast({
        title: "Error",
        description: "Failed to load script",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = async () => {
    try {
      await supabase.rpc('increment_script_views', { script_id: id });
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const checkUserVote = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('script_votes')
        .select('vote_type')
        .eq('script_id', id)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking user vote:', error);
        return;
      }

      setUserVote(data as UserVote);
    } catch (error) {
      console.error('Error in checkUserVote:', error);
    }
  };

  const handleVote = async (voteType: "upvote" | "downvote") => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Sign in required",
          description: "Please sign in to vote on scripts",
          variant: "destructive",
        });
        return;
      }

      setVoting(true);

      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('script_votes')
        .select('*')
        .eq('script_id', id)
        .eq('user_id', user.id)
        .single();

      if (existingVote) {
        if (existingVote.vote_type === voteType) {
          // Remove vote if clicking same vote
          await supabase
            .from('script_votes')
            .delete()
            .eq('id', existingVote.id);
          setUserVote(null);
        } else {
          // Update vote type
          await supabase
            .from('script_votes')
            .update({ vote_type: voteType })
            .eq('id', existingVote.id);
          setUserVote({ vote_type: voteType });
        }
      } else {
        // Create new vote
        await supabase
          .from('script_votes')
          .insert({
            script_id: id,
            user_id: user.id,
            vote_type: voteType,
          });
        setUserVote({ vote_type: voteType });
      }

      // Refresh script data to get updated vote counts
      fetchScript();
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Error",
        description: "Failed to register vote",
        variant: "destructive",
      });
    } finally {
      setVoting(false);
    }
  };

  const copyToClipboard = async () => {
    if (!script?.script_content) return;

    setCopying(true);
    try {
      await navigator.clipboard.writeText(script.script_content);
      toast({
        title: "Script copied!",
        description: "The script has been copied to your clipboard",
      });
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = script.script_content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      toast({
        title: "Script copied!",
        description: "The script has been copied to your clipboard",
      });
    } finally {
      setCopying(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading script...</p>
        </div>
      </div>
    );
  }

  if (!script) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6">😕</div>
          <h1 className="text-3xl font-bold mb-4">Script Not Found</h1>
          <p className="text-muted-foreground mb-6">The script you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/scripts">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Scripts
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const thumbnailUrl = script.custom_thumbnail_url || script.thumbnail_url;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/scripts">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Scripts
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Thumbnail */}
                  <div className="w-full lg:w-64 aspect-video bg-muted/30 rounded-lg overflow-hidden">
                    {thumbnailUrl ? (
                      <img
                        src={thumbnailUrl}
                        alt={script.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-gaming flex items-center justify-center">
                        <span className="text-4xl font-bold text-primary-foreground opacity-50">
                          {script.title.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h1 className="text-3xl font-bold mb-2">{script.title}</h1>
                        <p className="text-muted-foreground text-lg">{script.description}</p>
                      </div>
                      <Badge variant="secondary" className="bg-gaming-success/90 text-white">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Eye className="w-4 h-4" />
                        <span>{script.views.toLocaleString()} views</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(script.created_at)}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {script.works_on_mobile && (
                        <Badge variant="outline" className="bg-gaming-blue/10 text-gaming-blue border-gaming-blue/20">
                          <Smartphone className="w-3 h-3 mr-1" />
                          Mobile Compatible
                        </Badge>
                      )}
                      {script.has_keysystem && (
                        <Badge variant="outline" className="bg-gaming-warning/10 text-gaming-warning border-gaming-warning/20">
                          <Key className="w-3 h-3 mr-1" />
                          Key System
                        </Badge>
                      )}
                      {script.costs_money && (
                        <Badge variant="outline" className="bg-gaming-purple/10 text-gaming-purple border-gaming-purple/20">
                          <DollarSign className="w-3 h-3 mr-1" />
                          Paid
                        </Badge>
                      )}
                    </div>

                    {/* Vote Buttons */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={userVote?.vote_type === "upvote" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleVote("upvote")}
                        disabled={voting}
                        className="flex items-center space-x-1"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{script.upvotes}</span>
                      </Button>
                      <Button
                        variant={userVote?.vote_type === "downvote" ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => handleVote("downvote")}
                        disabled={voting}
                        className="flex items-center space-x-1"
                      >
                        <ThumbsDown className="w-4 h-4" />
                        <span>{script.downvotes}</span>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Flag className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Script Content */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Script Code</CardTitle>
                  <Button onClick={copyToClipboard} disabled={copying} className="flex items-center space-x-2">
                    <Copy className="w-4 h-4" />
                    <span>{copying ? "Copying..." : "Copy Script"}</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={script.script_content}
                  readOnly
                  className="min-h-96 font-mono text-sm bg-muted/50 border-border"
                  placeholder="Script content..."
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Features */}
            {script.features.length > 0 && (
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {script.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {script.tags.length > 0 && (
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {script.tags.map((tag, index) => (
                      <Badge key={index} className="bg-primary/10 text-primary hover:bg-primary/20">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Links */}
            {(script.script_link || script.game_link) && (
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">External Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {script.script_link && (
                    <Button asChild variant="outline" className="w-full">
                      <a href={script.script_link} target="_blank" rel="noopener noreferrer">
                        Script Source
                      </a>
                    </Button>
                  )}
                  {script.game_link && (
                    <Button asChild variant="outline" className="w-full">
                      <a href={script.game_link} target="_blank" rel="noopener noreferrer">
                        Play Game
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}