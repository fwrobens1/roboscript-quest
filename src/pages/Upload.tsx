import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Upload() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scriptContent, setScriptContent] = useState("");
  const [scriptLink, setScriptLink] = useState("");
  const [gameLink, setGameLink] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [customThumbnailUrl, setCustomThumbnailUrl] = useState("");
  const [worksOnMobile, setWorksOnMobile] = useState(false);
  const [hasKeysystem, setHasKeysystem] = useState(false);
  const [costsMoney, setCostsMoney] = useState(false);
  const [features, setFeatures] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (feature: string) => {
    setFeatures(features.filter(f => f !== feature));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to upload scripts",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from('scripts').insert({
        title: title.trim(),
        description: description.trim(),
        script_content: scriptContent.trim(),
        script_link: scriptLink.trim() || null,
        game_link: gameLink.trim() || null,
        thumbnail_url: thumbnailUrl.trim() || null,
        custom_thumbnail_url: customThumbnailUrl.trim() || null,
        works_on_mobile: worksOnMobile,
        has_keysystem: hasKeysystem,
        costs_money: costsMoney,
        features,
        tags,
        created_by: user.id,
      });

      if (error) {
        toast({
          title: "Error uploading script",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Script uploaded successfully!",
        description: "Your script has been added to the platform",
      });

      navigate("/scripts");
    } catch (error) {
      console.error('Error uploading script:', error);
      toast({
        title: "Error",
        description: "Failed to upload script",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Upload New Script</h1>
            <p className="text-muted-foreground text-lg">
              Share your script with the Roblox community
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Script Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter script title"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe what your script does..."
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="script-content">Script Content *</Label>
                    <Textarea
                      id="script-content"
                      value={scriptContent}
                      onChange={(e) => setScriptContent(e.target.value)}
                      placeholder="Paste your script code here..."
                      rows={8}
                      className="font-mono text-sm"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Links and Media */}
              <Card>
                <CardHeader>
                  <CardTitle>Links & Media</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="script-link">Script Link (Optional)</Label>
                    <Input
                      id="script-link"
                      value={scriptLink}
                      onChange={(e) => setScriptLink(e.target.value)}
                      placeholder="External script link (Pastebin, etc.)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="game-link">Game Link (Optional)</Label>
                    <Input
                      id="game-link"
                      value={gameLink}
                      onChange={(e) => setGameLink(e.target.value)}
                      placeholder="Roblox game URL"
                    />
                  </div>

                  <div>
                    <Label htmlFor="thumbnail">Default Thumbnail URL</Label>
                    <Input
                      id="thumbnail"
                      value={thumbnailUrl}
                      onChange={(e) => setThumbnailUrl(e.target.value)}
                      placeholder="Image URL for thumbnail"
                    />
                  </div>

                  <div>
                    <Label htmlFor="custom-thumbnail">Custom Thumbnail URL</Label>
                    <Input
                      id="custom-thumbnail"
                      value={customThumbnailUrl}
                      onChange={(e) => setCustomThumbnailUrl(e.target.value)}
                      placeholder="Custom image URL (overrides default)"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle>Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a feature (e.g., Auto Farm)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <Button type="button" onClick={addFeature} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="pr-1">
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(feature)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag (e.g., Blox Fruits)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <Badge key={index} className="pr-1 bg-gaming-accent/20 text-gaming-accent border-gaming-accent/30">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Properties */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Script Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="mobile"
                        checked={worksOnMobile}
                        onCheckedChange={setWorksOnMobile}
                      />
                      <Label htmlFor="mobile">Works on Mobile</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="keysystem"
                        checked={hasKeysystem}
                        onCheckedChange={setHasKeysystem}
                      />
                      <Label htmlFor="keysystem">Has Key System</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="costs-money"
                        checked={costsMoney}
                        onCheckedChange={setCostsMoney}
                      />
                      <Label htmlFor="costs-money">Costs Money</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/scripts")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !title.trim() || !description.trim() || !scriptContent.trim()}
                className="min-w-32"
              >
                {loading ? "Uploading..." : "Upload Script"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}