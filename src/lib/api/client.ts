/**
 * API client for RubaaniMuzik Studio backend.
 * Configure via VITE_API_BASE_URL environment variable.
 * Falls back to mock mode when no URL is set.
 */

import type {
  Project,
  GenerateContentRequest,
  GenerateContentResponse,
  PexelsSearchRequest,
  PexelsSearchResponse,
  RenderSettings,
  RenderJob,
  YouTubeUploadRequest,
  YouTubeUploadResponse,
  Metrics,
} from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

export const isApiConfigured = (): boolean => !!API_BASE_URL?.trim();

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!API_BASE_URL) {
    throw new ApiError(0, "API not configured. Set VITE_API_BASE_URL.");
  }

  const url = `${API_BASE_URL.replace(/\/$/, "")}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ApiError(res.status, body || res.statusText);
  }

  return res.json();
}

// ─── Projects ────────────────────────────────────────────

export const projects = {
  create: (data: GenerateContentRequest) =>
    request<Project>("/projects", { method: "POST", body: JSON.stringify(data) }),

  get: (id: string) =>
    request<Project>(`/projects/${id}`),

  list: () =>
    request<Project[]>("/projects"),

  update: (id: string, data: Partial<Project>) =>
    request<Project>(`/projects/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
};

// ─── Content Generation ──────────────────────────────────

export const generate = {
  content: (data: GenerateContentRequest) =>
    request<GenerateContentResponse>("/generate/content", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ─── Audio ───────────────────────────────────────────────

export const audio = {
  upload: async (projectId: string, file: File) => {
    if (!API_BASE_URL) throw new ApiError(0, "API not configured.");
    const url = `${API_BASE_URL.replace(/\/$/, "")}/projects/${projectId}/audio`;
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(url, { method: "POST", body: form });
    if (!res.ok) throw new ApiError(res.status, await res.text());
    return res.json() as Promise<{ audioFileUrl: string; audioDuration: number }>;
  },
};

// ─── Pexels Clips ────────────────────────────────────────

export const pexels = {
  search: (data: PexelsSearchRequest) =>
    request<PexelsSearchResponse>("/pexels/search", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ─── Rendering ───────────────────────────────────────────

export const render = {
  start: (projectId: string, settings: RenderSettings) =>
    request<RenderJob>(`/projects/${projectId}/render`, {
      method: "POST",
      body: JSON.stringify(settings),
    }),

  status: (projectId: string, jobId: string) =>
    request<RenderJob>(`/projects/${projectId}/render/${jobId}`),
};

// ─── YouTube ─────────────────────────────────────────────

export const youtube = {
  upload: (data: YouTubeUploadRequest) =>
    request<YouTubeUploadResponse>("/youtube/upload", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  connect: () =>
    request<{ authUrl: string }>("/youtube/connect"),
};

// ─── Analytics ───────────────────────────────────────────

export const analytics = {
  get: (projectId: string, from?: string, to?: string) => {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    return request<Metrics[]>(`/projects/${projectId}/metrics?${params}`);
  },
};

export const api = { projects, generate, audio, pexels, render, youtube, analytics };
export default api;
