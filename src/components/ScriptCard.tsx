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
      "group overflow-hidden bg-gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-glow hover:shadow-md transform-gpu",
      className
    )}>
      <div className="relative">
        {/* Thumbnail */}
        <div className="aspect-video bg-muted/30 relative overflow-hidden">
          {showImage ? (
            <img
              src={thumbnailUrl}
              alt={script.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-gaming flex items-center justify-center">
              <div className="text-4xl font-bold text-primary-foreground opacity-50">
                {script.title.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
          
          {/* Status badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            <Badge variant="secondary" className="bg-gaming-success/90 text-white text-xs">
              <Shield className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          </div>

          {/* Feature indicators */}
          <div className="absolute top-3 right-3 flex flex-col gap-1">
            {script.works_on_mobile && (
              <div className="p-1 bg-gaming-accent/90 rounded-full">
                <Smartphone className="w-3 h-3 text-white" />
              </div>
            )}
            {script.has_keysystem && (
              <div className="p-1 bg-gaming-warning/90 rounded-full">
                <Key className="w-3 h-3 text-white" />
              </div>
            )}
            {script.costs_money && (
              <div className="p-1 bg-gaming-dark/90 rounded-full">
                <DollarSign className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          {/* Stats overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3">
            <div className="flex items-center justify-between text-white text-sm">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <ThumbsUp className="w-3 h-3" />
                  <span>{formatCount(script.upvotes)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ThumbsDown className="w-3 h-3" />
                  <span>{formatCount(script.downvotes)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>{formatCount(script.views)}</span>
                </div>
              </div>
              <span className="text-xs opacity-75">{getTimeAgo(script.created_at)}</span>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Title and Description */}
        <div>
          <h3 className="font-semibold text-card-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {script.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {script.description}
          </p>
        </div>

        {/* Features */}
        {script.features.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {script.features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
            {script.features.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{script.features.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Tags */}
        {script.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {script.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs bg-gaming-accent/20 text-gaming-accent border-gaming-accent/30 hover:bg-gaming-accent/30">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Action Button */}
        <Button asChild variant="outline" className="w-full mt-3">
          <Link to={`/script/${script.id}`}>
            View Script
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}