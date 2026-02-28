import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, Music, CheckCircle2, Copy, Check, ExternalLink } from "lucide-react";

interface AudioStepProps {
  lyrics?: string;
  sunoPrompt?: string;
  onComplete: (audioFile: File, duration: number) => void;
}

const AudioStep = ({ lyrics, sunoPrompt, onComplete }: AudioStepProps) => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [copied, setCopied] = useState<string | null>(null);
  const [checklist, setChecklist] = useState({ generated: false, downloaded: false });
  const fileRef = useRef<HTMLInputElement>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioFile(file);
    const url = URL.createObjectURL(file);
    setAudioUrl(url);

    const audio = new Audio(url);
    audio.addEventListener("loadedmetadata", () => {
      setAudioDuration(Math.round(audio.duration));
    });
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="animate-slide-up space-y-8">
      {/* Suno Instructions */}
      <div className="studio-card space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
            <Music className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Generate in Suno</h3>
            <p className="text-sm text-muted-foreground">Use persona "Jonit" on suno.com</p>
          </div>
          <a
            href="https://suno.com"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto"
          >
            <Button variant="secondary" size="sm">
              Open Suno <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </a>
        </div>

        {/* Copy buttons */}
        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            variant="secondary"
            className="justify-start"
            onClick={() => copyToClipboard(lyrics || "", "lyrics")}
          >
            {copied === "lyrics" ? <Check className="mr-2 h-4 w-4 text-studio-success" /> : <Copy className="mr-2 h-4 w-4" />}
            Copy Lyrics
          </Button>
          <Button
            variant="secondary"
            className="justify-start"
            onClick={() => copyToClipboard(sunoPrompt || "", "prompt")}
          >
            {copied === "prompt" ? <Check className="mr-2 h-4 w-4 text-studio-success" /> : <Copy className="mr-2 h-4 w-4" />}
            Copy Suno Prompt
          </Button>
        </div>

        {/* Checklist */}
        <div className="space-y-2 rounded-lg bg-muted/50 p-4">
          <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Checklist</Label>
          <button
            onClick={() => setChecklist((c) => ({ ...c, generated: !c.generated }))}
            className="flex w-full items-center gap-3 text-sm text-left"
          >
            <CheckCircle2 className={`h-4 w-4 shrink-0 ${checklist.generated ? "text-studio-success" : "text-muted-foreground"}`} />
            <span className={checklist.generated ? "text-foreground" : "text-muted-foreground"}>
              Generated song in Suno with persona "Jonit"
            </span>
          </button>
          <button
            onClick={() => setChecklist((c) => ({ ...c, downloaded: !c.downloaded }))}
            className="flex w-full items-center gap-3 text-sm text-left"
          >
            <CheckCircle2 className={`h-4 w-4 shrink-0 ${checklist.downloaded ? "text-studio-success" : "text-muted-foreground"}`} />
            <span className={checklist.downloaded ? "text-foreground" : "text-muted-foreground"}>
              Downloaded audio file (mp3/wav)
            </span>
          </button>
        </div>
      </div>

      {/* Upload Section */}
      <div className="studio-card space-y-4">
        <Label className="text-sm font-medium text-foreground">Upload Audio File</Label>
        <div
          onClick={() => fileRef.current?.click()}
          className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all ${
            audioFile
              ? "border-primary/40 bg-primary/5"
              : "border-border hover:border-primary/30 hover:bg-muted/50"
          }`}
        >
          <Input
            ref={fileRef}
            type="file"
            accept="audio/mp3,audio/wav,audio/mpeg,.mp3,.wav"
            className="hidden"
            onChange={handleFileUpload}
          />
          {audioFile ? (
            <div className="space-y-2">
              <CheckCircle2 className="mx-auto h-10 w-10 text-studio-success" />
              <p className="font-medium text-foreground">{audioFile.name}</p>
              <p className="text-sm text-muted-foreground">
                Duration: {formatDuration(audioDuration)} · {(audioFile.size / (1024 * 1024)).toFixed(1)} MB
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="font-medium text-muted-foreground">Drop your audio file here</p>
              <p className="text-xs text-muted-foreground">Supports MP3, WAV</p>
            </div>
          )}
        </div>

        {audioUrl && (
          <audio controls className="w-full rounded-lg" src={audioUrl}>
            Your browser does not support the audio element.
          </audio>
        )}
      </div>

      {audioFile && audioDuration > 0 && (
        <Button
          onClick={() => onComplete(audioFile, audioDuration)}
          className="w-full py-5 text-base font-semibold"
          size="lg"
        >
          Continue to Clips →
        </Button>
      )}
    </div>
  );
};

export default AudioStep;
