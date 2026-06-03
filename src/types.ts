export interface VirtualFile {
  id: string;
  name: string;
  type: 'video' | 'extension' | 'document' | 'other';
  size: string; // e.g., '145 MB'
  downloadedAt: string;
  uploadedToDrive: boolean;
  driveFileId?: string;
  contentBlobUrl?: string; // local URL for physical downloads
}

export interface ChromeTab {
  id: string;
  title: string;
  url: string;
  type: 'github' | 'teams' | 'webstore' | 'blank' | 'drive' | 'custom';
  status: 'idle' | 'loading' | 'success';
}

export interface Extension {
  id: string;
  name: string;
  version: string;
  description: string;
  icon: string; // lucide icon name
  installed: boolean;
  enabled: boolean;
}

export interface DownloadTask {
  id: string;
  fileName: string;
  size: string;
  progress: number; // 0 to 100
  status: 'downloading' | 'completed' | 'failed';
}

export interface TeamsMeeting {
  id: string;
  title: string;
  date: string;
  duration: string;
  recordingSize: string;
  status: 'available' | 'downloaded';
  participantsCount: number;
  recordedBy: string;
}

export interface GDriveUser {
  name: string;
  email: string;
  picture: string;
}
