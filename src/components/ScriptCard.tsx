import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, ThumbsUp, ThumbsDown, Shield, Smartphone, DollarSign, Key } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ScriptCardProps {
  script: {
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
  };
  className?: string;
}

export function ScriptCard({ script, className }: ScriptCardProps) {
  const [imageError, setImageError] = useState(false);
  
  const thumbnailUrl = script.custom_thumbnail_url || script.thumbnail_url;
  const showImage = thumbnailUrl && !imageError;

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <Card className={cn(
      "group overflow-hidden bg-card border-border/30 hover:border-primary/40 transition-all duration-300 hover:shadow-card",
      className
    )}>
      <div className="relative">
        {/* Thumbnail */}
        <div className="aspect-video bg-muted relative overflow-hidden">
          {showImage ? (
            <img
              src={thumbnailUrl}
              alt={script.title}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-accent to-muted flex items-center justify-center">
              <div className="text-4xl font-bold text-muted-foreground/30">
                {script.title.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
          
          {/* Status badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            <Badge variant="secondary" className="bg-gaming-success text-white text-xs border-0">
              <Shield className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          </div>

          {/* Feature indicators */}
          <div className="absolute top-3 right-3 flex flex-col gap-1">
            {script.works_on_mobile && (
              <div className="p-1.5 bg-primary rounded-md">
                <Smartphone className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
            {script.has_keysystem && (
              <div className="p-1.5 bg-gaming-warning rounded-md">
                <Key className="w-3 h-3 text-white" />
              </div>
            )}
            {script.costs_money && (
              <div className="p-1.5 bg-destructive rounded-md">
                <DollarSign className="w-3 h-3 text-destructive-foreground" />
              </div>
            )}
          </div>

          {/* Date overlay */}
          <div className="absolute bottom-3 right-3">
            <span className="text-xs bg-black/60 text-white px-2 py-1 rounded-md">
              {getTimeAgo(script.created_at)}
            </span>
          </div>
        </div>
      </div>

      <CardContent className="p-4 space-y-4">
        {/* Title and Description */}
        <div>
          <h3 className="font-semibold text-card-foreground line-clamp-1 mb-2 group-hover:text-primary transition-colors">
            {script.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {script.description}
          </p>
        </div>

        {/* Game Tag (Primary) */}
        {script.tags.length > 0 && (
          <div>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-medium">
              {script.tags[0]}
            </Badge>
          </div>
        )}

        {/* Stats Row */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <ThumbsUp className="w-3 h-3" />
              <span>{formatCount(script.upvotes)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{formatCount(script.views)}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button asChild variant="outline" className="w-full border-border/50 hover:border-primary/50 hover:bg-primary/5">
          <Link to={`/script/${script.id}`}>
            View Script
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}