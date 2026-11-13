export type Language = 'kk' | 'ko' | 'en' | 'ru';

export type RepeatMode = 'off' | 'all' | 'one';

export type TabId = 'listen' | 'chart' | 'offline' | 'upload' | 'settings';

export type SongStatus = 'published' | 'pending' | 'removed';

export interface Song {
  id: string;
  title: string;
  artist: string;
  is_unknown_author: boolean;
  permission_note?: string;
  audio_url: string;
  storage_path?: string | null;
  duration_seconds: number;
  lyrics?: string | null;
  play_count: number;
  uploaded_by: string;
  status: SongStatus;
  is_active: boolean;
  created_at: string;
}

export type ReportType = 'claim_authorship' | 'request_removal' | 'correction' | 'message';

export interface SongReport {
  id: string;
  song_id?: string | null;
  song_title: string;
  report_type: ReportType;
  reporter_name?: string | null;
  reporter_contact: string;
  message: string;
  status: 'pending' | 'resolved' | 'dismissed';
  created_at: string;
}
