import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  Video, 
  Download, 
  User, 
  Clock, 
  FileVideo,
  Sparkles,
  ArrowRight,
  Tv,
  Puzzle,
  Play,
  Pause,
  Settings,
  CirclePlay
} from 'lucide-react';
import { TeamsMeeting, Extension } from '../types';

interface VirtualTeamsProps {
  extension: Extension;
  meetings: TeamsMeeting[];
  onTriggerDownload: (meeting: TeamsMeeting) => void;
  downloadingMeetingId: string | null;
  downloadProgress: number;
}

export default function VirtualTeams({ 
  extension, 
  meetings, 
  onTriggerDownload,
  downloadingMeetingId,
  downloadProgress
}: VirtualTeamsProps) {
  const [selectedMeeting, setSelectedMeeting] = useState<TeamsMeeting>(meetings[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(12);

  // Video playback indicator bar simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setVideoProgress(prev => (prev >= 100 ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleDownloadClick = () => {
    if (extension.installed && extension.enabled) {
      onTriggerDownload(selectedMeeting);
    }
  };

  return (
    <div className="bg-[#f3f2f1] text-[#242424] h-full flex font-sans overflow-hidden select-none">
      
      {/* 1. MS Teams Dark Left Navigation Bar */}
      <div className="w-16 bg-[#201f1e] shrink-0 flex flex-col items-center py-4 justify-between">
        <div className="flex flex-col items-center gap-5 w-full">
          {/* Teams App Icon Wrapper */}
          <div className="w-10 h-10 bg-[#4f46e5] text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-md cursor-pointer hover:bg-indigo-600 transition-all">
            T
          </div>
          <div className="flex flex-col items-center gap-4 w-full">
            <button className="p-2 text-[#a19f9d] hover:text-white rounded-lg hover:bg-[#323130] transition-colors relative">
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
              <Users className="w-5 h-5" />
            </button>
            <button className="p-2 text-white bg-[#323130] rounded-lg transition-colors border-l-2 border-[#6264a7]">
              <Video className="w-5 h-5 text-[#6264a7]" />
            </button>
            <button className="p-2 text-[#a19f9d] hover:text-white rounded-lg hover:bg-[#323130] transition-colors">
              <MessageSquare className="w-5 h-5" />
            </button>
            <button className="p-2 text-[#a19f9d] hover:text-white rounded-lg hover:bg-[#323130] transition-colors">
              <Calendar className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <button className="p-2 text-[#a19f9d] hover:text-white rounded-lg hover:bg-[#323130] transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-[#6264a7] text-white font-bold flex items-center justify-center text-xs border border-gray-700">
            AC
          </div>
        </div>
      </div>

      {/* 2. Channel List / Archive Panel */}
      <div className="w-64 bg-white border-r border-gray-200 shrink-0 flex flex-col">
        {/* Workspace Title */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <span className="font-bold text-gray-900 truncate">Ahmed Conan Cloud Dev</span>
        </div>

        {/* Channels scroll container */}
        <div className="flex-1 overflow-y-auto py-2">
          <div className="px-3 mb-2 flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <span>Teams & Channels</span>
          </div>

          <div className="space-y-0.5">
            <div className="px-3 py-1 font-bold text-sm text-gray-800 flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-[#6264a7] text-white text-[10px] flex items-center justify-center">AC</div>
              <span>General Syncs</span>
            </div>
            <button className="w-full text-left px-7 py-1.5 text-xs text-gray-500 hover:bg-gray-100 font-medium">
              General Chat
            </button>
            <button className="w-full text-left px-7 py-1.5 text-xs text-gray-600 bg-[#f3f2f1] font-bold text-[#6264a7] flex items-center gap-1.5 border-r-2 border-[#6264a7]">
              🛡️ Meeting Recordings
            </button>
            <button className="w-full text-left px-7 py-1.5 text-xs text-gray-500 hover:bg-gray-100 font-medium">
              Dev Deployments
            </button>
          </div>

          {/* Past Meetings List header */}
          <div className="px-3 mt-6 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <span>Select Recorded Meeting</span>
          </div>

          <div className="px-2 space-y-1">
            {meetings.map((meeting) => (
              <button
                key={meeting.id}
                onClick={() => { setSelectedMeeting(meeting); setIsPlaying(false); }}
                className={`w-full text-left p-2.5 rounded-lg border transition-all flex flex-col ${
                  selectedMeeting.id === meeting.id
                    ? 'bg-indigo-50 border-indigo-200 text-[#4f46e5]'
                    : 'bg-transparent border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-200'
                }`}
              >
                <span className="text-xs font-bold leading-tight line-clamp-1">{meeting.title}</span>
                <span className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {meeting.duration} • {meeting.recordingSize}
                </span>
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* 3. Main Workspace Area: Meeting Archive & Video Playback */}
      <div className="flex-1 flex flex-col bg-[#f8f9fa] overflow-y-auto">
        
        {/* Banner Section */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-xs shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
              <FileVideo className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-gray-900 text-sm md:text-base">{selectedMeeting.title}</span>
              <p className="text-xs text-gray-400 mt-0.5">Recorded on {selectedMeeting.date} by {selectedMeeting.recordedBy}</p>
            </div>
          </div>

          {/* Injected Action Button: Chrome Extension in Action */}
          <div className="flex items-center gap-2">
            {!extension.installed ? (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 p-2.5 rounded-lg text-xs max-w-sm">
                <Puzzle className="w-4 h-4 text-amber-600 shrink-0" />
                <div className="text-amber-800">
                  <span>Downloader extension missing. Install via the <strong>Chrome Web Store</strong> to download meeting.</span>
                </div>
              </div>
            ) : (
              <button
                onClick={handleDownloadClick}
                disabled={downloadingMeetingId === selectedMeeting.id}
                className={`px-4 py-2.5 rounded-lg font-bold text-xs shadow-sm transition-all flex items-center gap-2 border ${
                  downloadingMeetingId === selectedMeeting.id
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-[#6264a7] hover:bg-[#4f46e5] text-white border-[#585a95] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>
                  {downloadingMeetingId === selectedMeeting.id 
                    ? `Downloading segment (${downloadProgress}%)` 
                    : 'Download Recording MP4'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Video Player Display */}
        <div className="p-6 flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full space-y-6">
          
          {/* Simulated Video Player Container */}
          <div className="w-full aspect-video bg-[#1a1a1a] rounded-xl overflow-hidden relative shadow-lg group border border-gray-800 flex flex-col justify-between">
            {/* Top Control Bar overlay */}
            <div className="p-4 bg-gradient-to-down from-black/70 to-transparent flex items-center justify-between text-white z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                Teams Streaming Stream-segment MP4_H264
              </span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-xs font-mono">1080p Segmented</span>
            </div>

            {/* Injected Downloader Badge for Visual High-Fidelity */}
            {extension.installed && (
              <div className="absolute top-4 left-4 z-20 bg-indigo-600 text-white text-xs px-2.5 py-1.5 rounded-md font-bold shadow-md shadow-indigo-700/50 flex items-center gap-1.5 animate-bounce">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Extension Grabber Hook Enabled</span>
              </div>
            )}

            {/* Center Play Button overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 rounded-full bg-white/10 hover:bg-[#6264a7]/80 hover:scale-110 active:scale-95 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-xl"
              >
                {isPlaying ? <Pause className="w-8 h-8 fill-white" /> : <Play className="w-8 h-8 fill-white ml-1" />}
              </button>
            </div>

            {/* Video Canvas visualizer simulation */}
            <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
              {isPlaying ? (
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="flex gap-1.5 items-end h-12">
                    <span className="w-1.5 bg-indigo-500 rounded-full animate-pulse h-10"></span>
                    <span className="w-1.5 bg-indigo-600 rounded-full animate-pulse h-6" style={{ animationDelay: '0.15s' }}></span>
                    <span className="w-1.5 bg-indigo-400 rounded-full animate-pulse h-8" style={{ animationDelay: '0.3s' }}></span>
                    <span className="w-1.5 bg-purple-500 rounded-full animate-pulse h-12" style={{ animationDelay: '0.45s' }}></span>
                    <span className="w-1.5 bg-indigo-500 rounded-full animate-pulse h-4" style={{ animationDelay: '0.6s' }}></span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">Virtual Teams Audio/Video stream compiling active...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                    <CirclePlay className="w-10 h-10" />
                  </div>
                  <div className="text-center">
                    <span className="text-white text-sm font-bold block">{selectedMeeting.title}</span>
                    <span className="text-gray-500 text-xs">{selectedMeeting.recorderBy} • {selectedMeeting.date}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Playback bar */}
            <div className="bg-gradient-to-up from-black/80 via-black/40 to-transparent p-4 flex flex-col gap-2 z-10">
              {/* Progress Slider */}
              <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden cursor-pointer">
                <div className="bg-[#6264a7] h-full" style={{ width: `${videoProgress}%` }}></div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between text-white text-xs">
                <div className="flex items-center gap-3">
                  <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-[#6264a7]">
                    {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                  </button>
                  <span className="font-mono">03:{videoProgress.toString().padStart(2, '0')} / {selectedMeeting.duration}</span>
                </div>

                <div className="text-[10px] text-gray-400">
                  Capturable via Downloader: {extension.installed ? '✅ Yes' : '❌ Extension Required'}
                </div>
              </div>
            </div>
          </div>

          {/* Downloader extension guidance alert */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 w-full flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-gray-900">Chrome Extension Integration Flow</h4>
              <p className="text-xs text-gray-500">
                The Teams Web interface segment detector hooks with the active Chrome segment assembler down stream to save the compiled recording.
              </p>
            </div>

            <div className="flex gap-2 shrink-0 text-xs">
              <span className="bg-indigo-50 text-[#6264a7] px-3 py-1.5 rounded-lg border border-indigo-100 font-bold">
                Status: {extension.installed ? '🧩 Hook Active' : '🧩 Extension Offline'}
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
