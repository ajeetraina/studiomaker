import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { BarChart3, TrendingUp, Eye, Clock, MousePointerClick, Users, Sparkles } from "lucide-react";

const MOCK_METRICS = [
  { label: "Views", value: "1,247", icon: Eye, change: "+12%", good: true },
  { label: "Watch Time", value: "82h", icon: Clock, change: "+8%", good: true },
  { label: "Avg Duration", value: "2:34", icon: BarChart3, change: "+5%", good: true },
  { label: "CTR", value: "4.8%", icon: MousePointerClick, change: "-0.2%", good: false },
  { label: "Subs Gained", value: "23", icon: Users, change: "+15%", good: true },
];

const TrackStep = () => {
  return (
    <div className="animate-slide-up space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {MOCK_METRICS.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="studio-card space-y-2">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{m.label}</span>
              </div>
              <p className="text-xl font-bold text-foreground">{m.value}</p>
              <Badge
                variant="secondary"
                className={`text-[10px] ${
                  m.good
                    ? "bg-studio-success/10 text-studio-success border-studio-success/20"
                    : "bg-destructive/10 text-destructive border-destructive/20"
                }`}
              >
                <TrendingUp className={`mr-1 h-2.5 w-2.5 ${!m.good && "rotate-180"}`} />
                {m.change}
              </Badge>
            </div>
          );
        })}
      </div>

      {/* Performance Status */}
      <div className="studio-card studio-glow-border space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-studio-success animate-pulse-glow" />
          <span className="text-sm font-semibold text-studio-success">Doing Good!</span>
        </div>
        <p className="text-sm text-muted-foreground">
          All thresholds met. CTR is slightly below target (5%) — consider testing new thumbnails.
        </p>
      </div>

      {/* AI Insights */}
      <div className="studio-card space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <Label className="text-sm font-medium text-foreground">AI Insights</Label>
        </div>

        <div className="space-y-3">
          <div className="rounded-lg bg-muted/50 p-4 space-y-2">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Better Title Variants</p>
            <ul className="space-y-1 text-sm text-foreground">
              <li>• "Baarish Ki Raat | Jonit | Romantic Hindi 2026"</li>
              <li>• "Late Night Feels 🌧️ Jonit | Official Video"</li>
            </ul>
          </div>

          <div className="rounded-lg bg-muted/50 p-4 space-y-2">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Optimal Post Times</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">Friday 6PM IST</Badge>
              <Badge variant="secondary" className="text-xs">Saturday 8PM IST</Badge>
              <Badge variant="secondary" className="text-xs">Sunday 11AM IST</Badge>
            </div>
          </div>

          <div className="rounded-lg bg-muted/50 p-4 space-y-2">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Hashtag Suggestions</p>
            <p className="text-sm text-primary font-mono">
              #HindiLofi #RomanticSong2026 #IndieMusic #NightVibes #RainyMood
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackStep;
