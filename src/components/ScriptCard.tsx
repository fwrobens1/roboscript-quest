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
      "group overflow-hidden bg-card border-border/30 hover:border-primary/30 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5",
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
              <div className="text-3xl font-bold text-muted-foreground/30">
                {script.title.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
          
          {/* Status badge */}
          <div className="absolute top-2 left-2">
            <Badge className="bg-gaming-success/90 text-white text-xs border-0 px-2 py-1">
              <Shield className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          </div>

          {/* Feature indicators */}
          <div className="absolute top-2 right-2 flex gap-1">
            {script.works_on_mobile && (
              <div className="p-1 bg-primary/90 rounded-md backdrop-blur-sm">
                <Smartphone className="w-3 h-3 text-white" />
              </div>
            )}
            {script.has_keysystem && (
              <div className="p-1 bg-gaming-warning/90 rounded-md backdrop-blur-sm">
                <Key className="w-3 h-3 text-white" />
              </div>
            )}
            {script.costs_money && (
              <div className="p-1 bg-destructive/90 rounded-md backdrop-blur-sm">
                <DollarSign className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          {/* Date overlay */}
          <div className="absolute bottom-2 right-2">
            <span className="text-xs bg-black/60 text-white px-2 py-1 rounded-md backdrop-blur-sm">
              {getTimeAgo(script.created_at)}
            </span>
          </div>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Title and Description */}
        <div>
          <h3 className="font-semibold text-card-foreground line-clamp-1 mb-2 group-hover:text-primary transition-colors text-sm">
            {script.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {script.description}
          </p>
        </div>

        {/* Game Tag */}
        {script.tags.length > 0 && (
          <div>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
              {script.tags[0]}
            </Badge>
          </div>
        )}

        {/* Stats Row */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
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
        <Button asChild variant="outline" size="sm" className="w-full text-xs border-border/50 hover:border-primary/50 hover:bg-primary/5">
          <Link to={`/script/${script.id}`}>
            View Script
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}