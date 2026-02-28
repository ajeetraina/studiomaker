import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Wand2, Loader2, CheckCircle2, Heart, Moon, Train } from "lucide-react";

interface RenderStepProps {
  audioDuration?: number;
  clipCount?: number;
  onComplete: () => void;
}

const PRESETS = [
  {
    id: "soft-romance",
    name: "Soft Romance",
    icon: Heart,
    desc: "Fade transitions, Ken Burns, 3–5s cuts",
    cuts: "3–5s",
    transitions: "Fade",
    effects: "Gentle zoom/pan",
  },
  {
    id: "night-drive",
    name: "Night Drive Lofi",
    icon: Moon,
    desc: "Slower cuts, vignette, darker contrast",
    cuts: "4–6s",
    transitions: "Cross dissolve",
    effects: "Motion blur, vignette",
  },
  {
    id: "train-journey",
    name: "Train Journey",
    icon: Train,
    desc: "Rhythmic cuts, speed ramp, 2.5–4s",
    cuts: "2.5–4s",
    transitions: "Quick fade",
    effects: "Speed ramp",
  },
];

const RenderStep = ({ audioDuration = 0, clipCount = 0, onComplete }: RenderStepProps) => {
  const [preset, setPreset] = useState("soft-romance");
  const [overlays, setOverlays] = useState({
    watermark: true,
    titleIntro: true,
    waveform: false,
    filmGrain: false,
  });
  const [rendering, setRendering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [renderDone, setRenderDone] = useState(false);

  const handleRender = async () => {
    setRendering(true);
    setProgress(0);
    // Simulate render progress
    for (let i = 0; i <= 100; i += 2) {
      await new Promise((r) => setTimeout(r, 80));
      setProgress(i);
    }
    setRendering(false);
    setRenderDone(true);
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="animate-slide-up space-y-6">
      {/* Info bar */}
      <div className="flex flex-wrap gap-3">
        <Badge variant="secondary" className="text-xs">
          Audio: {formatDuration(audioDuration)}
        </Badge>
        <Badge variant="secondary" className="text-xs">
          {clipCount} clips selected
        </Badge>
        <Badge variant="secondary" className="text-xs">
          H.264 · AAC · 1080p · 30fps
        </Badge>
      </div>

      {/* Style Presets */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Style Preset</Label>
        <div className="grid gap-3 sm:grid-cols-3">
          {PRESETS.map((p) => {
            const Icon = p.icon;
            const isActive = preset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPreset(p.id)}
                className={`studio-card text-left transition-all ${
                  isActive ? "studio-glow-border" : "hover:border-primary/20"
                }`}
              >
                <Icon className={`h-5 w-5 mb-2 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                <p className="font-semibold text-sm text-foreground">{p.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  <Badge variant="secondary" className="text-[10px]">{p.cuts}</Badge>
                  <Badge variant="secondary" className="text-[10px]">{p.transitions}</Badge>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Overlays */}
      <div className="studio-card space-y-4">
        <Label className="text-sm font-medium text-foreground">Overlays & Effects</Label>
        {[
          { key: "watermark" as const, label: "RubaaniMuzik watermark", desc: "Small text in corner" },
          { key: "titleIntro" as const, label: "Title intro card", desc: "Track title for 3 seconds" },
          { key: "waveform" as const, label: "Audio waveform", desc: "Animated bar at bottom" },
          { key: "filmGrain" as const, label: "Film grain", desc: "Subtle vintage texture" },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between rounded-lg bg-muted/30 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <Switch
              checked={overlays[item.key]}
              onCheckedChange={(checked) => setOverlays((o) => ({ ...o, [item.key]: checked }))}
            />
          </div>
        ))}
      </div>

      {/* Render */}
      {rendering && (
        <div className="studio-card space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-foreground">Rendering...</Label>
            <span className="text-sm font-mono text-primary">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground font-mono">
            FFmpeg: encoding frame {Math.round(progress * 9)} / 900
          </p>
        </div>
      )}

      {renderDone ? (
        <div className="space-y-4">
          <div className="studio-card studio-glow-border flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-studio-success" />
            <div>
              <p className="font-semibold text-foreground">Render Complete!</p>
              <p className="text-sm text-muted-foreground">Video ready at 1920×1080, H.264, 30fps</p>
            </div>
          </div>
          <Button onClick={onComplete} className="w-full py-5 text-base font-semibold" size="lg">
            Continue to Upload →
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleRender}
          disabled={rendering}
          className="w-full py-6 text-base font-semibold"
          size="lg"
        >
          {rendering ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-5 w-5" />
          )}
          {rendering ? "Rendering..." : "Render Now"}
        </Button>
      )}
    </div>
  );
};

export default RenderStep;
