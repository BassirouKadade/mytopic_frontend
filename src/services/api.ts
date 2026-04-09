import axios from "axios";

const API_BASE = "http://localhost:8000/api/v1";

export interface Slide {
  slide_number: number;
  slide_type: string;
  title: string;
  purpose: string;
  content_format: string;
  main_content: string[];
  speaker_notes: string;
  suggested_visual: string | null;
  transition_to_next: string;
}

export interface Presentation {
  language: string;
  presentation_title: string;
  presentation_subtitle: string;
  target_audience: string;
  presentation_goal: string;
  tone: string;
  slides: Slide[];
}

export async function generatePresentation(
  topic: string,
  language?: string
): Promise<Presentation> {
  const res = await axios.post<Presentation>(`${API_BASE}/presentations/generate`, {
    topic,
    language: language || undefined,
  });
  return res.data;
}
