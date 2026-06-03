import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Home, 
  Search, 
  Puzzle, 
  ChevronRight, 
  ExternalLink,
  ShieldAlert,
  Download,
  Terminal,
  Grid,
  Menu,
  Sparkles,
  CloudUpload
} from 'lucide-react';
import { ChromeTab, Extension, TeamsMeeting, VirtualFile } from '../types';
import VirtualWebStore from './VirtualWebStore';
import VirtualTeams from './VirtualTeams';
import GoogleDriveManager from './GoogleDriveManager';

interface ChromeBrowserProps {
  extension: Extension;
  onInstallExtension: () => void;
  meetings: TeamsMeeting[];
  onTriggerDownload: (meeting: TeamsMeeting) => void;
  downloadingMeetingId: string | null;
  downloadProgress: number;
  downloadedFiles: VirtualFile[];
  onUploadSuccess: (fileId: string) => void;
}

export default function ChromeBrowser({
  extension,
  onInstallExtension,
  meetings,
  onTriggerDownload,
  downloadingMeetingId,
  downloadProgress,
  downloadedFiles,
  onUploadSuccess
}: ChromeBrowserProps) {
  const [tabs, setTabs] = useState<ChromeTab[]>([
    { id: 'webstore', title: 'Chrome Web Store', url: 'https://chromewebstore.google.com/teams-downloader', type: 'webstore', status: 'success' },
    { id: 'teams', title: 'Microsoft Teams v2 Web', url: 'https://teams.microsoft.com/v2/recordings', type: 'teams', status: 'success' },
    { id: 'drive', title: 'Google Drive Transporter', url: 'https://drive.google.com/drive/transporter', type: 'drive', status: 'success' }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('webstore');
  const [showExtensionPopup, setShowExtensionPopup] = useState(false);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId);
    setShowExtensionPopup(false);
  };

  return (
    <div className="bg-[#dee1e6] border border-gray-300 rounded-xl overflow-hidden font-sans shadow-2xl flex flex-col h-full select-none text-slate-800">
      
      {/* 1. Chrome Window Title Bar & Tabs Row */}
      <div className="flex items-center justify-between px-3 pt-2 bg-[#dee1e6] shrink-0 border-b border-[#c4c7cc]">
        {/* Linux-like Window Controls */}
        <div className="flex items-center gap-1.5 shrink-0 px-1 py-1 mr-4">
          <span className="w-3 h-3 rounded-full bg-[#f25f56] opacity-75"></span>
          <span className="w-3 h-3 rounded-full bg-[#f5be4f] opacity-75"></span>
          <span className="w-3 h-3 rounded-full bg-[#4fc358] opacity-75"></span>
        </div>

        {/* Browser Tabs Scrollable track */}
        <div className="flex-1 flex items-end gap-1.5 overflow-x-auto min-w-0 pr-6 mt-1 flex-nowrap [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-xs font-semibold select-none cursor-pointer transition-all shrink-0 max-w-[170px] border-t border-x border-transparent relative top-[1px] ${
                  isActive 
                    ? 'bg-gray-100 text-[#202124] border-gray-300 font-bold z-10' 
                    : 'text-[#5f6368] hover:bg-gray-200/50'
                }`}
              >
                {tab.id === 'webstore' && <Puzzle className="w-3.5 h-3.5 text-blue-600" />}
                {tab.id === 'teams' && <span className="w-3.5 h-3.5 rounded-sm bg-[#5c5fc8] text-white flex items-center justify-center font-bold text-[8px]">T</span>}
                {tab.id === 'drive' && <CloudUpload className="w-3.5 h-3.5 text-[#0f9d58]" />}
                
                <span className="truncate">{tab.title}</span>
                {!isActive && (
                  <span className="text-[10px] text-gray-400 absolute right-1.5 top-3 hover:text-gray-700"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Chrome URL Bar & Navigation Controls */}
      <div className="bg-gray-100 border-b border-gray-200 px-4 py-2.5 flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-1.5 text-gray-500">
          <button className="p-1 rounded-full hover:bg-gray-200/60 transition-colors cursor-not-allowed text-gray-300">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button className="p-1 rounded-full hover:bg-gray-200/60 transition-colors cursor-not-allowed text-gray-300">
            <ArrowRight className="w-4 h-4" />
          </button>
          <button className="p-1 rounded-full hover:bg-gray-200/60 transition-colors">
            <RotateCw className="w-3.5 h-3.5 text-gray-600" />
          </button>
          <button className="p-1 rounded-full hover:bg-gray-200/60 transition-colors">
            <Home className="w-3.5 h-3.5 text-gray-600" />
          </button>
        </div>

        {/* Address URL field */}
        <div className="flex-1 relative">
          <div className="bg-[#f1f3f4] text-[#202124] border border-transparent hover:border-gray-300 focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-xs py-1 px-4.5 rounded-full text-xs flex items-center justify-between gap-2 overflow-hidden transition-all h-8">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <span className="text-[10px] text-gray-400 select-none">🔒 Secure</span>
              <span className="text-[#202124] font-medium font-mono truncate">{activeTab.url}</span>
            </div>
          </div>
        </div>

        {/* Extensions Container toolbar trigger */}
        <div className="flex items-center gap-2 shrink-0 relative">
          {extension.installed ? (
            <button
              onClick={() => setShowExtensionPopup(!showExtensionPopup)}
              className={`p-1.5 rounded-lg border flex items-center justify-center transition-all cursor-pointer relative ${
                showExtensionPopup 
                  ? 'bg-purple-100 hover:bg-purple-150 border-purple-300 text-purple-700' 
                  : 'bg-white hover:bg-gray-50 border-gray-250 text-gray-700 hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-600 fill-purple-100 animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-[#0f9d58] absolute -top-0.5 -right-0.5 border border-white"></span>
            </button>
          ) : (
            <div className="p-1.5 bg-gray-50 text-gray-300 rounded-lg border border-gray-100">
              <Puzzle className="w-4 h-4" />
            </div>
          )}

          {/* Quick extension helper dropdown popup */}
          {showExtensionPopup && (
            <div className="absolute right-0 top-10 bg-white rounded-xl shadow-xl border border-gray-200 p-4.5 w-64 z-50 text-xs text-gray-700 block animate-in fade-in duration-100">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2 mb-2">
                <Puzzle className="w-4 h-4 text-[#6264a7]" />
                <span className="font-bold text-gray-900">{extension.name}</span>
              </div>
              <div className="space-y-2">
                <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100 text-[10px] text-emerald-800 flex items-center gap-1.5 font-semibold">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  Stream Segment Grabber: ACTIVE
                </div>
                <p className="leading-relaxed text-gray-500">
                  Extension injected into Teams player frame. Navigate to Microsoft Teams Web to capture MP4 meeting recordings.
                </p>

                <div className="border-t border-gray-100 pt-2 flex items-center justify-between text-[10px]">
                  <span className="text-gray-400">Status: enabled</span>
                  <button 
                    onClick={() => { handleTabClick('teams'); }}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    Go to Teams
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="w-[1px] h-4 bg-gray-200 mx-1"></div>

          <button className="p-1.5 text-gray-600 hover:bg-gray-200/60 rounded-full">
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Render Simulated Website View depending on Active Tab */}
      <div className="flex-1 bg-white min-h-0 overflow-hidden">
        {activeTabId === 'webstore' && (
          <VirtualWebStore 
            extension={extension}
            onInstallExtension={onInstallExtension}
          />
        )}

        {activeTabId === 'teams' && (
          <VirtualTeams 
            extension={extension}
            meetings={meetings}
            onTriggerDownload={onTriggerDownload}
            downloadingMeetingId={downloadingMeetingId}
            downloadProgress={downloadProgress}
          />
        )}

        {activeTabId === 'drive' && (
          <GoogleDriveManager 
            downloadedFiles={downloadedFiles}
            onUploadSuccess={onUploadSuccess}
          />
        )}
      </div>

    </div>
  );
}
