import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Youtube, CheckCircle2, Loader2, ExternalLink } from "lucide-react";

interface UploadStepProps {
  titleOptions?: string[];
  description?: string;
  onComplete: (youtubeUrl: string) => void;
}

const UploadStep = ({ titleOptions = [], description = "", onComplete }: UploadStepProps) => {
  const [connected, setConnected] = useState(false);
  const [title, setTitle] = useState(titleOptions[0] || "");
  const [desc, setDesc] = useState(description);
  const [visibility, setVisibility] = useState("private");
  const [scheduleDate, setScheduleDate] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleConnect = () => setConnected(true);

  const handleUpload = async () => {
    setUploading(true);
    for (let i = 0; i <= 100; i += 5) {
      await new Promise((r) => setTimeout(r, 100));
      setUploadProgress(i);
    }
    setUploading(false);
    setUploaded(true);
  };

  if (!connected) {
    return (
      <div className="animate-slide-up space-y-6">
        <div className="studio-card flex flex-col items-center gap-4 py-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
            <Youtube className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Connect YouTube</h3>
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            Authorize RubaaniMuzik channel to upload videos directly from the studio.
          </p>
          <Button onClick={handleConnect} size="lg">
            <Youtube className="mr-2 h-5 w-5" />
            Connect YouTube Channel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-up space-y-6">
      <div className="studio-card space-y-1">
        <div className="flex items-center gap-2 text-studio-success">
          <CheckCircle2 className="h-4 w-4" />
          <span className="text-sm font-medium">Connected: RubaaniMuzik</span>
        </div>
      </div>

      {/* Video Details */}
      <div className="studio-card space-y-4">
        <Label className="text-sm font-medium text-foreground">Video Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} className="bg-secondary border-border" />

        {titleOptions.length > 1 && (
          <div className="flex flex-wrap gap-1.5">
            {titleOptions.map((t, i) => (
              <button
                key={i}
                onClick={() => setTitle(t)}
                className={`text-xs rounded-md px-2.5 py-1 transition-all ${
                  title === t
                    ? "bg-primary/20 text-primary border border-primary/40"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                Option {i + 1}
              </button>
            ))}
          </div>
        )}

        <Label className="text-sm font-medium text-foreground">Description & Hashtags</Label>
        <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={6} className="bg-secondary border-border font-mono text-sm" />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Visibility</Label>
            <Select value={visibility} onValueChange={setVisibility}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="unlisted">Unlisted</SelectItem>
                <SelectItem value="public">Public</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Schedule (optional)</Label>
            <Input
              type="datetime-local"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="bg-secondary border-border"
            />
          </div>
        </div>
      </div>

      {uploaded ? (
        <div className="space-y-4">
          <div className="studio-card studio-glow-border flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-studio-success" />
            <div className="flex-1">
              <p className="font-semibold text-foreground">Uploaded Successfully!</p>
              <a href="#" className="text-sm text-primary hover:underline flex items-center gap-1">
                youtube.com/watch?v=demo123 <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
          <Button onClick={() => onComplete("https://youtube.com/watch?v=demo123")} className="w-full py-5 text-base font-semibold" size="lg">
            Continue to Track →
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleUpload}
          disabled={uploading || !title.trim()}
          className="w-full py-6 text-base font-semibold"
          size="lg"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Uploading... {uploadProgress}%
            </>
          ) : (
            <>
              <Upload className="mr-2 h-5 w-5" />
              Upload & Schedule
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default UploadStep;
