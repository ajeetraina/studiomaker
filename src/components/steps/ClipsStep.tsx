import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Wand2, Check, Film, Loader2, AlertCircle, Download, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
  width: number;
  height: number;
  pexelsUrl: string;
}

const STORAGE_KEY = "pexels_api_key";

const buildQueries = (visualBrief?: string): string[] => {
  const base = ["rain city night", "night drive car", "train window rain", "city lights bokeh", "sunset cinematic", "moonlight couple"];
  if (!visualBrief) return base;
  const words = visualBrief
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3);
  const uniq = Array.from(new Set(words)).slice(0, 6);
  if (uniq.length >= 3) {
    return [
      uniq.slice(0, 2).join(" "),
      uniq.slice(1, 3).join(" "),
      uniq.slice(2, 4).join(" ") || uniq[0],
      uniq.slice(0, 3).join(" "),
      "cinematic " + (uniq[0] || "mood"),
      "moody " + (uniq[1] || uniq[0] || "night"),
    ].filter(Boolean);
  }
  return base;
};

const pickBestFile = (files: any[], aspectRatio: "16:9" | "9:16") => {
  const want = aspectRatio === "9:16" ? "portrait" : "landscape";
  const filtered = files.filter((f: any) => f.width && f.height && f.file_type?.includes("mp4"));
  const oriented = filtered.filter((f: any) =>
    want === "portrait" ? f.height >= f.width : f.width >= f.height
  );
  const pool = (oriented.length ? oriented : filtered).filter((f: any) => f.width >= 1080 || f.height >= 1080);
  const final = pool.length ? pool : oriented.length ? oriented : filtered;
  // pick smallest >=1080 to keep downloads reasonable
  final.sort((a: any, b: any) => (a.width * a.height) - (b.width * b.height));
  return final[0] || files[0];
};

const ClipsStep = ({ visualBrief, aspectRatio = "16:9", onComplete }: ClipsStepProps) => {
  const [pexelsKey, setPexelsKey] = useState(() => localStorage.getItem(STORAGE_KEY) || "");
  const [keyConfigured, setKeyConfigured] = useState(() => !!localStorage.getItem(STORAGE_KEY));
  const [searching, setSearching] = useState(false);
  const [clips, setClips] = useState<Clip[]>([]);
  const [queries, setQueries] = useState<string[]>([]);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const handleConfigureKey = () => {
    if (pexelsKey.trim()) {
      localStorage.setItem(STORAGE_KEY, pexelsKey.trim());
      setKeyConfigured(true);
    }
  };

  const handleSearch = async () => {
    setSearching(true);
    setClips([]);
    const qs = buildQueries(visualBrief);
    setQueries(qs);
    const orientation = aspectRatio === "9:16" ? "portrait" : "landscape";
    try {
      const results: Clip[] = [];
      let nextId = 0;
      for (const q of qs) {
        const res = await fetch(
          `https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&per_page=3&orientation=${orientation}&size=medium`,
          { headers: { Authorization: pexelsKey } }
        );
        if (!res.ok) {
          if (res.status === 401) {
            toast({ title: "Invalid Pexels API key", description: "Check your key and try again.", variant: "destructive" });
            localStorage.removeItem(STORAGE_KEY);
            setKeyConfigured(false);
            setSearching(false);
            return;
          }
          continue;
        }
        const data = await res.json();
        for (const v of data.videos || []) {
          const file = pickBestFile(v.video_files || [], aspectRatio);
          if (!file?.link) continue;
          results.push({
            id: nextId++,
            src: file.link,
            thumbnail: v.image,
            duration: v.duration,
            query: q,
            selected: results.length < 6,
            width: file.width,
            height: file.height,
            pexelsUrl: v.url,
          });
        }
      }
      if (results.length === 0) {
        toast({ title: "No clips found", description: "Try a different visual brief or query.", variant: "destructive" });
      }
      setClips(results);
    } catch (e: any) {
      toast({ title: "Search failed", description: e?.message || "Network error", variant: "destructive" });
    } finally {
      setSearching(false);
    }
  };

  const toggleClip = (id: number) => {
    setClips(clips.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c)));
  };

  const autoSelect = () => {
    setClips(clips.map((c, i) => ({ ...c, selected: i < 8 })));
  };

  const downloadClip = async (clip: Clip) => {
    setDownloadingId(clip.id);
    try {
      const res = await fetch(clip.src);
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pexels-${clip.id}-${clip.query.replace(/\s+/g, "-")}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(clip.src, "_blank", "noopener,noreferrer");
    } finally {
      setDownloadingId(null);
    }
  };

  const resetKey = () => {
    localStorage.removeItem(STORAGE_KEY);
    setKeyConfigured(false);
    setPexelsKey("");
    setClips([]);
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
      <div className="studio-card space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-foreground">Video Clips from Pexels</Label>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {aspectRatio} · 1080p min
            </Badge>
            <Button variant="ghost" size="sm" onClick={resetKey} className="text-xs h-7">
              Change key
            </Button>
          </div>
        </div>

        {visualBrief && (
          <p className="text-sm text-muted-foreground rounded-lg bg-muted/50 p-3">
            <span className="font-medium text-foreground">Visual brief:</span> {visualBrief}
          </p>
        )}

        <div className="flex gap-2">
          <Button onClick={handleSearch} disabled={searching} className="flex-1">
            {searching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
            {searching ? "Searching Pexels..." : "Search Pexels Clips"}
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

      {clips.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-muted-foreground">{selectedClips.length} of {clips.length} clips selected</Label>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clips.map((clip) => (
              <div
                key={clip.id}
                className={`group relative overflow-hidden rounded-xl bg-card transition-all ${
                  clip.selected
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                    : "ring-1 ring-border hover:ring-primary/30"
                }`}
              >
                <button onClick={() => toggleClip(clip.id)} className="block w-full text-left">
                  <div className="aspect-video bg-muted relative">
                    <video
                      src={clip.src}
                      poster={clip.thumbnail}
                      className="h-full w-full object-cover"
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play().catch(() => {})}
                      onMouseLeave={(e) => {
                        const v = e.currentTarget as HTMLVideoElement;
                        v.pause();
                        v.currentTime = 0;
                      }}
                    />
                    {clip.selected && (
                      <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                        <Check className="h-3.5 w-3.5 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </button>
                <div className="p-2 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-foreground truncate">{clip.query}</p>
                    <p className="text-xs text-muted-foreground">{clip.duration}s · {clip.width}×{clip.height}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={(e) => { e.stopPropagation(); window.open(clip.pexelsUrl, "_blank", "noopener,noreferrer"); }}
                      title="Open on Pexels"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={(e) => { e.stopPropagation(); downloadClip(clip); }}
                      disabled={downloadingId === clip.id}
                      title="Download MP4"
                    >
                      {downloadingId === clip.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                </div>
              </div>
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

      {!clips.length && !searching && (
        <div className="studio-card text-center text-sm text-muted-foreground py-10">
          <Film className="h-8 w-8 mx-auto mb-2 opacity-40" />
          Click "Search Pexels Clips" to fetch videos matching your visual brief.
        </div>
      )}
    </div>
  );
};

export default ClipsStep;
