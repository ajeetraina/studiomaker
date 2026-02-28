/** Shared types for the backend API */

export interface Project {
  id: string;
  status: "draft" | "audio" | "clips" | "rendering" | "rendered" | "uploaded" | "published";
  mood: string;
  tempo: string;
  keywords: string[];
  aspectRatio: "16:9" | "9:16";
  lyrics: string;
  sunoPrompt: string;
  visualBrief: string;
  titleOptions: string[];
  description: string;
  audioFileUrl?: string;
  audioDuration?: number;
  pexelsQueries?: string[];
  selectedClips?: ClipData[];
  renderPreset?: string;
  renderSettings?: RenderSettings;
  renderedVideoUrl?: string;
  youtubeVideoId?: string;
  youtubeUrl?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClipData {
  id: string;
  src: string;
  thumbnail: string;
  duration: number;
  query: string;
  width: number;
  height: number;
}

export interface RenderSettings {
  preset: string;
  watermark: boolean;
  titleIntro: boolean;
  waveform: boolean;
  filmGrain: boolean;
}

export interface RenderJob {
  id: string;
  projectId: string;
  status: "queued" | "processing" | "completed" | "failed";
  progress: number;
  logs?: string[];
  error?: string;
  outputUrl?: string;
}

export interface GenerateContentRequest {
  mood: string;
  tempo: string;
  keywords: string[];
  aspectRatio: "16:9" | "9:16";
}

export interface GenerateContentResponse {
  lyrics: string;
  sunoPrompt: string;
  visualBrief: string;
  titleOptions: string[];
  description: string;
}

export interface PexelsSearchRequest {
  visualBrief: string;
  aspectRatio: "16:9" | "9:16";
  maxClips?: number;
}

export interface PexelsSearchResponse {
  queries: string[];
  clips: ClipData[];
}

export interface UploadAudioRequest {
  projectId: string;
  file: File;
}

export interface UploadAudioResponse {
  audioFileUrl: string;
  audioDuration: number;
}

export interface YouTubeUploadRequest {
  projectId: string;
  title: string;
  description: string;
  visibility: "private" | "unlisted" | "public";
  scheduledAt?: string;
}

export interface YouTubeUploadResponse {
  videoId: string;
  videoUrl: string;
}

export interface Metrics {
  projectId: string;
  date: string;
  views: number;
  watchTime: number;
  avgViewDuration: number;
  ctr: number;
  subsGained: number;
}
