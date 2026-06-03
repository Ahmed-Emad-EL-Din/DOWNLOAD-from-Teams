import React, { useState, useEffect } from 'react';
import { 
  Github, 
  Tv, 
  Puzzle, 
  Video, 
  CloudUpload, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Clock, 
  ExternalLink,
  ShieldAlert,
  Cpu,
  Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Extension, TeamsMeeting, VirtualFile } from './types';
import GitHubBrowser from './components/GitHubBrowser';
import ChromeBrowser from './components/ChromeBrowser';

export default function App() {
  const [activeSection, setActiveSection] = useState<'github' | 'chrome'>('github');
  
  // Virtual extension state
  const [extension, setExtension] = useState<Extension>({
    id: 'teams-segment-downloader',
    name: 'Teams Recording Stream Downloader',
    version: '1.2.4',
    description: 'Enables direct segment extraction and high-speed MP4 reassembly of MS Teams meeting video streams.',
    icon: 'puzzle',
    installed: false,
    enabled: true
  });

  // Past meetings list inside Teams
  const [meetings, setMeetings] = useState<TeamsMeeting[]>([
    {
      id: 'm1',
      title: 'Weekly_Status_&_Deployment_Roadmap',
      date: 'Today, 2 hours ago',
      duration: '42:15',
      recordingSize: '85.4 MB',
      status: 'available',
      participantsCount: 8,
      recordedBy: 'Ahmed Conan'
    },
    {
      id: 'm2',
      title: 'AI_Architecture_Alignment_&_Brainstorming',
      date: 'Yesterday',
      duration: '01:15:20',
      recordingSize: '145.2 MB',
      status: 'available',
      participantsCount: 12,
      recordedBy: 'Engineering Lead'
    },
    {
      id: 'm3',
      title: 'Q2_Business_Strategy_Pitch_and_Demo',
      date: 'May 28, 2026',
      duration: '28:40',
      recordingSize: '58.1 MB',
      status: 'available',
      participantsCount: 4,
      recordedBy: 'Product Manager'
    }
  ]);

  // Download files sandbox queue
  const [downloadedFiles, setDownloadedFiles] = useState<VirtualFile[]>([]);
  const [downloadingMeetingId, setDownloadingMeetingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Time stamp state
  const [currentTime, setCurrentTime] = useState('17:15:00 UTC');

  useEffect(() => {
    // Keep a beautiful formatted live UTC clock
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toISOString().substring(11, 19) + ' UTC');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleInstallExtension = () => {
    setExtension(prev => ({ ...prev, installed: true }));
  };

  // Trigger segment download
  const handleTriggerDownload = (meeting: TeamsMeeting) => {
    if (downloadingMeetingId) return;

    setDownloadingMeetingId(meeting.id);
    setDownloadProgress(0);

    const progressInterval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 250);

    // Assembly completion
    setTimeout(() => {
      const newFile: VirtualFile = {
        id: Math.random().toString(),
        name: `${meeting.title}.mp4`,
        type: 'video',
        size: meeting.recordingSize,
        downloadedAt: new Date().toLocaleTimeString(),
        uploadedToDrive: false
      };
      setDownloadedFiles(prev => [newFile, ...prev]);
      setDownloadingMeetingId(null);
    }, 2800);
  };

  const handleUploadSuccess = (fileId: string) => {
    setDownloadedFiles(prev => prev.map(f => f.id === fileId ? { ...f, uploadedToDrive: true } : f));
  };

  // Checklist completion states mapping
  const isCodeChecked = true;
  const isExtensionAdded = extension.installed;
  const isVideoDownloaded = downloadedFiles.length > 0;
  const isUploadedToDrive = downloadedFiles.some(f => f.uploadedToDrive);

  return (
    <div className="min-h-screen bg-[#070913] text-gray-100 flex flex-col font-sans select-none antialiased">
      
      {/* 1. Global Navigation Bar Header */}
      <header className="bg-[#0b0e1a]/95 border-b border-gray-800/80 sticky top-0 z-30 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/15 shadow-sm shadow-indigo-500/5">
            <Layers className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold font-display tracking-tight text-white">Chromium Sandbox Desk</h1>
              <span className="bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20 text-[9px] uppercase px-1.5 py-0.5 rounded-full">v1.2.0</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">Simulate extension integrations & Drive transfer pipelines</p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center flex-wrap gap-3">
          {/* Section Switches */}
          <div className="bg-[#0e1227] p-1 border border-gray-800/80 rounded-lg text-xs flex items-center shadow-xs">
            <button 
              type="button"
              onClick={() => setActiveSection('github')}
              className={`px-4 py-1.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeSection === 'github' 
                  ? 'bg-gradient-to-r from-gray-800 to-gray-700/80 text-white border border-gray-600/30' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Github className="w-3.5 h-3.5" /> Source Hub
            </button>
            <button 
              type="button"
              id="chrome-tab-trigger"
              onClick={() => setActiveSection('chrome')}
              className={`px-4 py-1.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeSection === 'chrome' 
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5 text-indigo-200" /> Virtual Chrome
            </button>
          </div>

          <div className="w-[1px] h-6 bg-gray-800 hidden sm:block"></div>

          {/* Time Marker widget */}
          <div className="bg-[#0e1227] px-3 py-1.5 rounded-lg border border-gray-800/80 text-[10px] font-mono text-gray-400 flex items-center gap-2 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{currentTime}</span>
          </div>
        </div>
      </header>

      {/* 2. Interactive Step-by-Step Guidance Bar */}
      <div className="bg-[#090c1f] border-b border-gray-800/60 p-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Step 1 */}
            <div className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
              isCodeChecked 
                ? 'bg-indigo-500/[0.02] border-indigo-600/30 text-white' 
                : 'bg-gray-900/10 border-gray-800 text-gray-400'
            }`}>
              <CheckCircle2 className={`w-5 h-5 shrink-0 ${isCodeChecked ? 'text-indigo-400 fill-indigo-500/10' : 'text-gray-600'}`} />
              <div>
                <span className="text-[10px] font-bold text-gray-500 block">Step 1</span>
                <span className="text-xs font-bold block mt-0.5">Explore Codebase</span>
                <span className="text-[10px] text-gray-400 block mt-1 leading-normal">Inspect downloader manifest on GitHub source repository.</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
              isExtensionAdded 
                ? 'bg-indigo-500/[0.02] border-indigo-600/30 text-white animate-in zoom-in-95' 
                : 'bg-gray-900/10 border-gray-800 text-gray-400'
            }`}>
              <CheckCircle2 className={`w-5 h-5 shrink-0 ${isExtensionAdded ? 'text-indigo-400 fill-indigo-500/10' : 'text-gray-600'}`} />
              <div>
                <span className="text-[10px] font-bold text-gray-500 block">Step 2</span>
                <span className="text-xs font-bold block mt-0.5">Activate Downloader</span>
                <span className="text-[10px] text-gray-400 block mt-1 leading-normal">Open Web Store tab inside Chrome & install the direct capture extension.</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
              isVideoDownloaded 
                ? 'bg-indigo-500/[0.02] border-indigo-600/30 text-white' 
                : 'bg-gray-900/10 border-gray-800 text-gray-400'
            }`}>
              <CheckCircle2 className={`w-5 h-5 shrink-0 ${isVideoDownloaded ? 'text-indigo-400 fill-indigo-500/10' : 'text-gray-600'}`} />
              <div>
                <span className="text-[10px] font-bold text-gray-500 block">Step 3</span>
                <span className="text-xs font-bold block mt-0.5">Download Recording</span>
                <span className="text-[10px] text-gray-400 block mt-1 leading-normal">Open Teams tab, select a meeting recording & hit Download video.</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
              isUploadedToDrive 
                ? 'bg-emerald-500/[0.02] border-emerald-600/30 text-white' 
                : 'bg-gray-900/10 border-gray-800 text-gray-400'
            }`}>
              <CheckCircle2 className={`w-5 h-5 shrink-0 ${isUploadedToDrive ? 'text-emerald-400 fill-emerald-500/10' : 'text-gray-600'}`} />
              <div>
                <span className="text-[10px] font-bold text-gray-500 block">Step 4</span>
                <span className="text-xs font-bold block mt-0.5">Backup to GDrive</span>
                <span className="text-[10px] text-gray-400 block mt-1 leading-normal">Log in, select downloaded MP4, and trigger cloud sync to GDrive!</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 3. Main Sandbox Workspace Frame */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 overflow-hidden flex flex-col justify-stretch">
        <div className="flex-1 relative min-h-0 min-w-0">
          <AnimatePresence mode="wait">
            {activeSection === 'github' ? (
              <motion.div
                key="github"
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 w-full h-full"
              >
                <GitHubBrowser onLaunchBrowser={() => setActiveSection('chrome')} />
              </motion.div>
            ) : (
              <motion.div
                key="chrome"
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 w-full h-full"
              >
                <ChromeBrowser 
                  extension={extension}
                  onInstallExtension={handleInstallExtension}
                  meetings={meetings}
                  onTriggerDownload={handleTriggerDownload}
                  downloadingMeetingId={downloadingMeetingId}
                  downloadProgress={downloadProgress}
                  downloadedFiles={downloadedFiles}
                  onUploadSuccess={handleUploadSuccess}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* 4. Minimalist Workspace Footer */}
      <footer className="bg-[#070913] border-t border-gray-800/40 px-6 py-4 flex items-center justify-between text-xs text-gray-500 tracking-wide">
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-gray-600" />
          <span>Active Sandbox Port: Interleaved Iframe Context</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hover:text-gray-300 cursor-pointer">Security Protocol TLS 1.3</span>
          <span>•</span>
          <span className="hover:text-gray-300 cursor-pointer">Google Drive OAuth Ready</span>
        </div>
      </footer>

    </div>
  );
}
