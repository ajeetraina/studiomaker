import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Wand2, Check, Film, Loader2, AlertCircle } from "lucide-react";

interface ClipsStepProps {
  visualBrief?: string;
  aspectRatio?: "16:9" | "9:16";
  onComplete: (clips: Clip[]) => void;
}

interface Clip {
  id: number;
  src: string;
  thumbnail: string;
  duration: number;
  query: string;
  selected: boolean;
}

const MOCK_CLIPS: Clip[] = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  src: `https://example.com/clip-${i}.mp4`,
  thumbnail: `https://images.pexels.com/videos/${3000000 + i * 100}/free-video-${3000000 + i * 100}.jpg?auto=compress&cs=tinysrgb&w=400`,
  duration: Math.floor(Math.random() * 15) + 5,
  query: ["rain city", "night drive", "train window", "city lights", "sunset", "moonlight"][i % 6],
  selected: i < 6,
}));

const ClipsStep = ({ visualBrief, aspectRatio, onComplete }: ClipsStepProps) => {
  const [pexelsKey, setPexelsKey] = useState("");
  const [keyConfigured, setKeyConfigured] = useState(false);
  const [searching, setSearching] = useState(false);
  const [clips, setClips] = useState<Clip[]>([]);
  const [queries, setQueries] = useState<string[]>([]);

  const handleConfigureKey = () => {
    if (pexelsKey.trim()) {
      setKeyConfigured(true);
    }
  };

  const handleSearch = async () => {
    setSearching(true);
    await new Promise((r) => setTimeout(r, 1500));
    setQueries(["rain city night", "night drive car", "train window rain", "city lights bokeh", "sunset cinematic", "moonlight couple"]);
    setClips(MOCK_CLIPS);
    setSearching(false);
  };

  const toggleClip = (id: number) => {
    setClips(clips.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c)));
  };

  const autoSelect = () => {
    setClips(clips.map((c, i) => ({ ...c, selected: i < 8 })));
  };

  const selectedClips = clips.filter((c) => c.selected);

  if (!keyConfigured) {
    return (
      <div className="animate-slide-up space-y-6">
        <div className="studio-card space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-studio-info/15">
              <AlertCircle className="h-5 w-5 text-studio-info" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Connect Pexels API</h3>
              <p className="text-sm text-muted-foreground">
                Get a free API key at{" "}
                <a href="https://www.pexels.com/api/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  pexels.com/api
                </a>
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Input
              type="password"
              value={pexelsKey}
              onChange={(e) => setPexelsKey(e.target.value)}
              placeholder="Enter Pexels API key..."
              className="bg-secondary border-border"
            />
            <Button onClick={handleConfigureKey} disabled={!pexelsKey.trim()}>
              Connect
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-up space-y-6">
      {/* Search Controls */}
      <div className="studio-card space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-foreground">Video Clips from Pexels</Label>
          <Badge variant="secondary" className="text-xs">
            {aspectRatio} · 1080p min
          </Badge>
        </div>

        {visualBrief && (
          <p className="text-sm text-muted-foreground rounded-lg bg-muted/50 p-3">
            <span className="font-medium text-foreground">Visual brief:</span> {visualBrief}
          </p>
        )}

        <div className="flex gap-2">
          <Button onClick={handleSearch} disabled={searching} className="flex-1">
            {searching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
            {searching ? "Searching..." : "Search Pexels Clips"}
          </Button>
          {clips.length > 0 && (
            <Button variant="secondary" onClick={autoSelect}>
              <Wand2 className="mr-2 h-4 w-4" /> Auto-select Best
            </Button>
          )}
        </div>

        {queries.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {queries.map((q) => (
              <Badge key={q} variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                {q}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Clips Grid */}
      {clips.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-muted-foreground">{selectedClips.length} of {clips.length} clips selected</Label>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {clips.map((clip) => (
              <button
                key={clip.id}
                onClick={() => toggleClip(clip.id)}
                className={`group relative overflow-hidden rounded-xl transition-all ${
                  clip.selected
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                    : "ring-1 ring-border hover:ring-primary/30"
                }`}
              >
                <div className={`aspect-video bg-muted flex items-center justify-center`}>
                  <Film className="h-8 w-8 text-muted-foreground/30" />
                </div>
                {clip.selected && (
                  <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                    <Check className="h-3.5 w-3.5 text-primary-foreground" />
                  </div>
                )}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-background/80 to-transparent p-2">
                  <p className="text-xs text-foreground truncate">{clip.query}</p>
                  <p className="text-xs text-muted-foreground">{clip.duration}s</p>
                </div>
              </button>
            ))}
          </div>

          <Button
            onClick={() => onComplete(selectedClips)}
            disabled={selectedClips.length === 0}
            className="w-full py-5 text-base font-semibold"
            size="lg"
          >
            Continue to Render ({selectedClips.length} clips) →
          </Button>
        </div>
      )}
    </div>
  );
};

export default ClipsStep;
