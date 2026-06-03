import React, { useState } from 'react';
import { 
  Puzzle, 
  Search, 
  Star, 
  Check, 
  ShieldAlert, 
  Download, 
  Users, 
  ChevronRight,
  Info
} from 'lucide-react';
import { Extension } from '../types';

interface VirtualWebStoreProps {
  extension: Extension;
  onInstallExtension: () => void;
}

export default function VirtualWebStore({ extension, onInstallExtension }: VirtualWebStoreProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showInstallConfirm, setShowInstallConfirm] = useState(false);
  const [installing, setInstalling] = useState(false);

  const handleInstallClick = () => {
    if (!extension.installed) {
      setShowInstallConfirm(true);
    }
  };

  const confirmInstall = () => {
    setShowInstallConfirm(false);
    setInstalling(true);
    setTimeout(() => {
      onInstallExtension();
      setInstalling(false);
    }, 1500);
  };

  return (
    <div className="bg-[#f8f9fa] text-[#202124] h-full flex flex-col font-sans select-none relative">
      {/* Chrome Web Store Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-blue-600 rounded-lg text-white">
            <Puzzle className="w-6 h-6" />
          </div>
          <div>
            <span className="font-bold text-gray-950 font-sans tracking-tight text-lg">chrome web store</span>
            <div className="flex items-center gap-2 text-xs text-blue-600 font-medium">
              <span>Extensions</span>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <span className="text-gray-500 font-normal">Productivity</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search extensions and themes"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 border border-transparent hover:bg-gray-200/60 focus:bg-white focus:border-blue-500 focus:outline-hidden py-1.5 pl-10 pr-4 rounded-full text-sm text-gray-900 transition-all font-sans"
          />
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
          
          {/* Extension Listing Top Card */}
          <div className="p-8 border-b border-gray-200 flex flex-col md:flex-row items-start justify-between gap-6 bg-white">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200 shrink-0 shadow-xs">
                <Puzzle className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">{extension.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-2">
                  <span className="text-blue-600 hover:underline cursor-pointer font-medium">Ahmed Conan Automation Devs</span>
                  <div className="flex items-center gap-1 text-amber-500 font-medium">
                    <Star className="w-4 h-4 fill-amber-500" /> 4.9 <span>(2,408 reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Users className="w-4 h-4 text-gray-400" /> <span>50,000+ users</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#0f9d58] bg-[#e6f4ea] px-2 py-0.5 rounded-full w-max mt-3 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0f9d58]"></span>
                  Compatible with Microsoft Teams v2
                </div>
              </div>
            </div>

            {/* Install Button Actions */}
            <div className="shrink-0 w-full md:w-auto">
              {extension.installed ? (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-[#0f9d58] font-bold text-sm bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-lg shadow-sm">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Added to Chrome</span>
                  </div>
                  <span className="text-[10px] text-gray-400 text-center">Extension status: Enabled</span>
                </div>
              ) : (
                <button
                  onClick={handleInstallClick}
                  disabled={installing}
                  className={`w-full md:w-auto font-semibold px-6 py-2.5 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 border ${
                    installing
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-700 hover:shadow-md'
                  }`}
                >
                  {installing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
                      <span>Installing...</span>
                    </>
                  ) : (
                    <>
                      <Puzzle className="w-4 h-4" />
                      <span>Add to Chrome</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Details / Description Section Tab */}
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Left description text */}
              <div className="md:col-span-2 space-y-5">
                <div>
                  <h3 className="text-gray-900 font-bold text-sm uppercase tracking-wider">Overview</h3>
                  <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                    {extension.description} Direct multi-segment audio/video stream downloader for standard web platforms. Bypasses restricted playback pipelines to extract recording segments and package them securely as standard MP4 files.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                    <Info className="w-4 h-4 text-blue-600" />
                    How to use in Microsoft Teams
                  </div>
                  <ul className="list-disc pl-5 text-gray-600 text-xs space-y-1.5 leading-relaxed">
                    <li>Install the extension by clicking <strong className="text-gray-800">"Add to Chrome"</strong>.</li>
                    <li>Navigate to the <strong className="text-gray-800">Teams Web tab</strong> in this simulated browser.</li>
                    <li>Open an active chat channel and select the past meeting recording card.</li>
                    <li>Click play, then click the floating action button <strong className="text-blue-600 font-semibold">"Download with stream Downloader"</strong> to save the MP4 video!</li>
                  </ul>
                </div>
              </div>

              {/* Right metadata key values */}
              <div className="border-l border-gray-100 pl-0 md:pl-8 space-y-4 text-xs text-gray-500">
                <div>
                  <span className="font-semibold text-gray-800 block">Version</span>
                  <span>{extension.version}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-800 block">Updated</span>
                  <span>June 3, 2026</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-800 block">Size</span>
                  <span>424 KiB</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-800 block">Language</span>
                  <span>English (United States)</span>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <span className="font-semibold text-gray-800 block flex items-center gap-1.5 mb-1 text-amber-600">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Permissions
                  </span>
                  <p className="leading-relaxed">
                    Reads media stream segments exclusively from teams.microsoft.com and creates sandboxed local downloads. Integrates directly with client-side Drive.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Confirmation Modal overlay dialog */}
      {showInstallConfirm && (
        <div className="absolute inset-0 bg-black/45 flex items-center justify-center z-50 p-4 font-sans backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full border border-gray-200 p-6 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                <Puzzle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-gray-900 font-bold text-sm leading-snug">
                  Add "Teams Recording & Media Downloader"?
                </h3>
                <span className="text-xs text-gray-400 block">By Ahmed Conan Automation Devs</span>
              </div>
            </div>

            <div className="text-xs text-gray-600 space-y-2 border-y border-gray-100 py-3 block leading-relaxed">
              <span className="font-semibold text-gray-800 block mb-1">It can:</span>
              <p className="flex items-center gap-1.5">• Read and capture active media streams on Teams</p>
              <p className="flex items-center gap-1.5">• Create local file download instances</p>
              <p className="flex items-center gap-1.5">• Connect to the Google Drive uploader widget</p>
            </div>

            <div className="flex items-center justify-end gap-2 text-xs pt-1">
              <button
                onClick={() => setShowInstallConfirm(false)}
                className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmInstall}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
              >
                Add extension
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
