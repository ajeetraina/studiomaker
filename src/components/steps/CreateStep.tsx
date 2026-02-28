import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, Copy, Check } from "lucide-react";
import { api, isApiConfigured } from "@/lib/api";

const MOODS = ["Romantic", "Lofi", "Sad", "Dreamy", "Energetic"];
const TEMPOS = ["Slow", "Medium"];
const VIBE_SUGGESTIONS = ["rain", "night drive", "train", "window", "city lights", "sunset", "moonlight", "café", "ocean", "rooftop"];

interface CreateStepProps {
  onComplete: (data: ProjectData) => void;
}

export interface ProjectData {
  title: string;
  mood: string;
  tempo: string;
  keywords: string[];
  aspectRatio: "16:9" | "9:16";
  lyrics: string;
  sunoPrompt: string;
  visualBrief: string;
  titleOptions: string[];
  description: string;
}

const CreateStep = ({ onComplete }: CreateStepProps) => {
  const [mood, setMood] = useState("");
  const [tempo, setTempo] = useState("Slow");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [customKeyword, setCustomKeyword] = useState("");
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("16:9");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Mock generated data
  const [projectData, setProjectData] = useState<ProjectData | null>(null);

  const addKeyword = (kw: string) => {
    if (kw && !keywords.includes(kw)) {
      setKeywords([...keywords, kw]);
    }
    setCustomKeyword("");
  };

  const removeKeyword = (kw: string) => {
    setKeywords(keywords.filter((k) => k !== kw));
  };

  const handleGenerate = async () => {
    setGenerating(true);

    try {
      if (isApiConfigured()) {
        // Use real backend API
        const result = await api.generate.content({ mood, tempo, keywords, aspectRatio });
        const data: ProjectData = {
          title: `${mood} ${keywords[0] || "vibes"} — Jonit`,
          mood, tempo, keywords, aspectRatio,
          ...result,
        };
        setProjectData(data);
      } else {
        // Mock fallback
        await new Promise((r) => setTimeout(r, 2000));
        const data: ProjectData = {
          title: `${mood} ${keywords[0] || "vibes"} — Jonit`,
          mood, tempo, keywords, aspectRatio,
          lyrics: `[Verse 1]\nRaat ki baarish mein, tere khayalon ka mausam\nDil ke sheher mein, tu hai mera mehman\nHar lamha tujhse, har pal tujhse\nYe dil maange bas tera daaman\n\n[Chorus]\nTu meri dhun hai, tu meri lau\nJal rahi hai ye raat, tujhpe hai bharosa\nTu meri dhun hai, tu meri lau\nBas tere saath, har sapna hoga raushan\n\n[Verse 2]\nCity lights mein teri parchaaiyan\nTrain ki khidki se dikhe teri nishaaniyan\nMain likhta rahunga, ye gaane tere liye\nHar sur mein tera naam, har taal mein teri yaadein`,
          sunoPrompt: `Hindi Indi-pop romantic song, slow tempo, male vocals by Jonit, ${mood.toLowerCase()} mood, dreamy synths, soft acoustic guitar, lo-fi beats, emotional, cinematic, ${keywords.join(", ")}`,
          visualBrief: `Scene ideas: ${keywords.map(k => `cinematic ${k} shots`).join(", ")}. Use slow motion, warm color grading, soft bokeh lights. Transition style: gentle fades. Overall mood: ${mood.toLowerCase()}, intimate, nostalgic.`,
          titleOptions: [
            `${keywords[0] ? keywords[0].charAt(0).toUpperCase() + keywords[0].slice(1) : "Sapne"} | Jonit | Official Music Video`,
            `Jonit - ${mood} Vibes (Official Video) | RubaaniMuzik`,
            `Tere Khayalon Mein | Jonit | ${mood} Hindi Song 2026`,
          ],
          description: `🎵 ${mood} vibes by Jonit | RubaaniMuzik\n\nStream everywhere: [links]\n\n#RubaaniMuzik #Jonit #HindiSong #${mood} #IndiPop ${keywords.map(k => `#${k.replace(/\s/g, "")}`).join(" ")}`,
        };
        setProjectData(data);
      }
    } catch (err) {
      console.error("Generate failed, using mock:", err);
      // Fallback to mock on API error
      await new Promise((r) => setTimeout(r, 1000));
      const data: ProjectData = {
        title: `${mood} ${keywords[0] || "vibes"} — Jonit`,
        mood, tempo, keywords, aspectRatio,
        lyrics: "[Verse 1]\nRaat ki baarish mein...\n[Chorus]\nTu meri dhun hai...",
        sunoPrompt: `Hindi Indi-pop, ${mood.toLowerCase()}, Jonit, ${keywords.join(", ")}`,
        visualBrief: `Cinematic ${keywords.join(", ")} scenes. ${mood} mood.`,
        titleOptions: [`${mood} Vibes | Jonit | RubaaniMuzik`],
        description: `🎵 ${mood} by Jonit #RubaaniMuzik`,
      };
      setProjectData(data);
    }

    setGenerated(true);
    setGenerating(false);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="animate-slide-up space-y-8">
      {/* Input Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Mood */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Mood</Label>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => (
              <button
                key={m}
                onClick={() => setMood(m)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  mood === m
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-studio-surface-hover"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Tempo */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Tempo</Label>
          <div className="flex gap-2">
            {TEMPOS.map((t) => (
              <button
                key={t}
                onClick={() => setTempo(t)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  tempo === t
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-studio-surface-hover"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Vibe Keywords */}
        <div className="space-y-3 md:col-span-2">
          <Label className="text-sm font-medium text-foreground">Vibe Keywords</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {VIBE_SUGGESTIONS.map((v) => (
              <button
                key={v}
                onClick={() => addKeyword(v)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  keywords.includes(v)
                    ? "bg-primary/20 text-primary border border-primary/40"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={customKeyword}
              onChange={(e) => setCustomKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addKeyword(customKeyword)}
              placeholder="Add custom keyword..."
              className="bg-secondary border-border"
            />
            <Button variant="secondary" onClick={() => addKeyword(customKeyword)}>
              Add
            </Button>
          </div>
          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {keywords.map((kw) => (
                <Badge
                  key={kw}
                  variant="secondary"
                  className="cursor-pointer bg-primary/15 text-primary border-primary/30 hover:bg-destructive/20 hover:text-destructive hover:border-destructive/30"
                  onClick={() => removeKeyword(kw)}
                >
                  {kw} ×
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Aspect Ratio */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Aspect Ratio</Label>
          <div className="flex gap-2">
            {(["16:9", "9:16"] as const).map((ar) => (
              <button
                key={ar}
                onClick={() => setAspectRatio(ar)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  aspectRatio === ar
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-studio-surface-hover"
                }`}
              >
                <div
                  className={`border-2 rounded-sm ${aspectRatio === ar ? "border-primary-foreground" : "border-muted-foreground"} ${
                    ar === "16:9" ? "w-6 h-4" : "w-4 h-6"
                  }`}
                />
                {ar}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={!mood || keywords.length === 0 || generating}
        className="w-full py-6 text-base font-semibold"
        size="lg"
      >
        {generating ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-5 w-5" />
        )}
        {generating ? "Generating with AI..." : "Generate Project"}
      </Button>

      {/* Generated Output */}
      {generated && projectData && (
        <div className="space-y-6 animate-slide-up">
          <h3 className="text-lg font-semibold studio-gradient-text">Generated Content</h3>

          {/* Lyrics */}
          <div className="studio-card space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-foreground">Lyrics (Suno-friendly)</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(projectData.lyrics, "lyrics")}
                className="text-muted-foreground hover:text-primary"
              >
                {copied === "lyrics" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Textarea value={projectData.lyrics} readOnly rows={10} className="bg-muted/50 border-border font-mono text-sm" />
          </div>

          {/* Suno Prompt */}
          <div className="studio-card space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-foreground">Suno Prompt</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(projectData.sunoPrompt, "suno")}
                className="text-muted-foreground hover:text-primary"
              >
                {copied === "suno" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Textarea value={projectData.sunoPrompt} readOnly rows={3} className="bg-muted/50 border-border font-mono text-sm" />
          </div>

          {/* Visual Brief */}
          <div className="studio-card space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-foreground">Visual Brief</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(projectData.visualBrief, "visual")}
                className="text-muted-foreground hover:text-primary"
              >
                {copied === "visual" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Textarea value={projectData.visualBrief} readOnly rows={3} className="bg-muted/50 border-border font-mono text-sm" />
          </div>

          {/* Title Options */}
          <div className="studio-card space-y-3">
            <Label className="text-sm font-medium text-foreground">YouTube Title Options</Label>
            <div className="space-y-2">
              {projectData.titleOptions.map((title, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-3">
                  <span className="text-sm font-mono text-muted-foreground">{i + 1}.</span>
                  <span className="text-sm flex-1">{title}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(title, `title-${i}`)}
                    className="text-muted-foreground hover:text-primary shrink-0"
                  >
                    {copied === `title-${i}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="studio-card space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-foreground">YouTube Description + Hashtags</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(projectData.description, "desc")}
                className="text-muted-foreground hover:text-primary"
              >
                {copied === "desc" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Textarea value={projectData.description} readOnly rows={5} className="bg-muted/50 border-border font-mono text-sm" />
          </div>

          <Button onClick={() => onComplete(projectData)} className="w-full py-5 text-base font-semibold" size="lg">
            Continue to Audio →
          </Button>
        </div>
      )}
    </div>
  );
};

export default CreateStep;
