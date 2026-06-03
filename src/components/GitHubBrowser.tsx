import React, { useState } from 'react';
import { 
  Github, 
  Folder, 
  FileText, 
  Code, 
  BookOpen, 
  Play, 
  Terminal, 
  GitBranch, 
  Star, 
  GitFork, 
  ArrowRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';

interface GitHubBrowserProps {
  onLaunchBrowser: () => void;
}

export default function GitHubBrowser({ onLaunchBrowser }: GitHubBrowserProps) {
  const [activeTab, setActiveTab] = useState<'code' | 'readme' | 'vnc_guide'>('code');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const repoFiles = [
    { name: '.devcontainer/devcontainer.json', type: 'file', size: '1.8 KB', content: `{
  "name": "Virtual Chromium NoVNC Sandbox",
  "image": "mcr.microsoft.com/devcontainers/universal:2",
  "features": {
    "ghcr.io/devcontainers/features/desktop-lite:1": {
      "version": "latest",
      "vncPassword": "password"
    }
  },
  "customizations": {
    "vscode": {
      "extensions": [
        "ms-azuretools.vscode-docker",
        "ms-cecilsp.novnc-viewer"
      ]
    }
  },
  "forwardPorts": [6080, 5901],
  "portsAttributes": {
    "6080": {
      "label": "Virtual Desktop UI VNC",
      "onAutoForward": "openBrowser"
    }
  },
  "postCreateCommand": "echo 'NoVNC Server successfully initialized on Port 6080! Launching simulated Chromium browser...'"
}` },
    { name: 'extension/', type: 'folder', size: '-' },
    { name: 'extension/manifest.json', type: 'file', size: '1.2 KB', content: `{
  "manifest_version": 3,
  "name": "Teams Recording & Media Downloader",
  "version": "1.0.0",
  "description": "Enables direct high-speed download of Microsoft Teams session recordings and streams.",
  "permissions": ["activeTab", "downloads", "storage"],
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["https://teams.microsoft.com/*", "https://*.teams.microsoft.com/*"],
      "js": ["content.js"]
    }
  ]
}` },
    { name: 'extension/background.js', type: 'file', size: '3.4 KB', content: `// Listens for download requests and proxies high-volume media segments
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'trigger_teams_download') {
    const { videoUrl, title } = message;
    console.log('Initiating segmented stream recording download for:', title);
    chrome.downloads.download({
      url: videoUrl,
      filename: \`TeamsMedia/\${title}.mp4\`,
      saveAs: false
    });
  }
});` },
    { name: 'extension/content.js', type: 'file', size: '4.8 KB', content: `// Inject capture overlay directly onto MS Teams video players
function findTeamsVideoFrame() {
  const videoElement = document.querySelector('video');
  if (videoElement && !document.getElementById('grabber-overlay-btn')) {
    const parentContainer = videoElement.parentElement;
    const downloadBtn = document.createElement('button');
    downloadBtn.id = 'grabber-overlay-btn';
    downloadBtn.innerText = '⬇️ Download via Stream Grabber';
    downloadBtn.style.cssText = 'position: absolute; top: 12px; right: 12px; z-index: 9999; background: #5c5fc8; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-weight: 500; font-family: system-ui;';
    downloadBtn.onclick = () => {
      chrome.runtime.sendMessage({
        action: 'trigger_teams_download',
        videoUrl: videoElement.src || 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-his-computer-34287-large.mp4',
        title: document.title || 'Teams_Meeting_Recording'
      });
    };
    parentContainer?.appendChild(downloadBtn);
  }
}
setInterval(findTeamsVideoFrame, 2000);` },
    { name: 'README.md', type: 'file', size: '2.5 KB', content: `# Teams-to-Drive Browser Sync Architecture 🚀

This repo details and implements a custom browser-level network workflow:
1. **GitHub Setup**: Access this source code to verify script integrity.
2. **Launch Chromium Sandbox**: Spins up a virtual secure chromium instance.
3. **Install Extension**: Installs the \`Teams Stream Downloader\` in Chrome.
4. **Acquire Target Media**: Securely connects to Teams to segment and download past meeting videos to your virtual storage.
5. **Direct Google Drive Backlist**: Integrates with Google Drive API for transparent, multi-part parallel backup.

### Features
- Stream segment reconstruction bypasses authentication blockades.
- Localized Google Drive auth using Firebase/OAuth ensures data is never leaked to external services.` },
  ];

  const handleFileClick = (fileName: string, type: string) => {
    if (type === 'file') {
      setSelectedFile(fileName);
      setActiveTab('code');
    }
  };

  const getFileContent = () => {
    if (!selectedFile) {
      return repoFiles.find(f => f.name === 'README.md')?.content || '';
    }
    return repoFiles.find(f => f.name === selectedFile)?.content || '';
  };

  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden font-sans text-[#c9d1d9] shadow-2xl h-full flex flex-col">
      {/* GitHub Repo Header */}
      <div className="bg-[#161b22] border-b border-[#30363d] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#21262d] rounded-lg border border-[#30363d]">
            <Github className="w-6 h-6 text-[#58a6ff]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[#58a6ff] hover:underline font-semibold cursor-pointer">ahmedconan</span>
              <span className="text-[#8b949e]">/</span>
              <span className="font-semibold text-white cursor-pointer hover:underline">teams-to-drive-extension</span>
              <span className="bg-[#21262d] text-xs px-2 py-0.5 rounded-full border border-[#30363d] text-[#8b949e]">Public</span>
            </div>
            <p className="text-xs text-[#8b949e] mt-1">Simulated Chromium sandbox with MS Teams capture automation and custom Drive backup.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="flex items-center bg-[#21262d] border border-[#30363d] rounded-md overflow-hidden text-xs font-medium">
            <button className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-[#30363d] border-r border-[#30363d] text-[#8b949e]">
              <Star className="w-3.5 h-3.5" /> Star <span className="bg-[#30363d] text-white px-1.5 py-0.5 rounded-full text-[10px]">142</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-[#30363d] text-[#8b949e]">
              <GitFork className="w-3.5 h-3.5" /> Fork <span className="bg-[#30363d] text-white px-1.5 py-0.5 rounded-full text-[10px]">23</span>
            </button>
          </div>
          
          <button 
            id="launch-browser"
            onClick={onLaunchBrowser}
            className="flex items-center gap-2 bg-[#238636] hover:bg-[#2ea043] text-white font-medium text-sm px-4 py-1.5 rounded-md transition-colors shadow-lg shadow-[#238636]/20 shrink-0"
          >
            <Play className="w-4 h-4 fill-white shrink-0" />
            <span>Launch Virtual Chrome</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Code Browser Body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
        {/* Left Side: Repositories File Tree */}
        <div className="w-full md:w-64 border-r border-[#30363d] bg-[#0d1117] flex flex-col overflow-y-auto p-3 shrink-0">
          <span className="text-xs font-semibold text-[#8b949e] uppercase px-2 mb-2">Workspace Source Files</span>
          <div className="space-y-0.5">
            {repoFiles.map((file) => (
              <button
                key={file.name}
                onClick={() => handleFileClick(file.name, file.type)}
                className={`w-full flex items-center justify-between text-left px-2 py-2 rounded-md text-sm transition-colors ${
                  (selectedFile === file.name || (!selectedFile && file.name === 'README.md'))
                    ? 'bg-[#21262d] text-white border-l-2 border-[#58a6ff]' 
                    : 'hover:bg-[#161b22] text-[#c9d1d9]'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {file.type === 'folder' ? (
                    <Folder className="w-4 h-4 text-[#54a3ff] shrink-0" />
                  ) : (
                    <FileText className="w-4 h-4 text-[#8b949e] shrink-0" />
                  )}
                  <span className="truncate font-mono text-xs">{file.name}</span>
                </div>
                <span className="text-[10px] text-[#8b949e] shrink-0">{file.size}</span>
              </button>
            ))}
          </div>

          {/* Quick Guide */}
          <div className="mt-auto pt-6 border-t border-[#30363d] p-2">
            <div className="bg-[#161b22] p-3 rounded-lg border border-[#30363d] space-y-2">
              <div className="flex items-center gap-2 text-xs text-[#58a6ff]">
                <Cpu className="w-4 h-4" />
                <span className="font-semibold">Automation Workflow</span>
              </div>
              <p className="text-[11px] text-[#8b949e] leading-relaxed">
                Click <strong className="text-white">Launch Virtual Chrome</strong> to load the browser and install the grabber chrome extension to download MS Teams video.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Code Viewer & Tab Layout */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-[#0d1117]">
          {/* Navigation Bar */}
          <div className="bg-[#161b22] px-4 py-2 border-b border-[#30363d] flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => { setActiveTab('code'); }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 ${
                  activeTab === 'code' ? 'bg-[#21262d] text-white' : 'text-[#8b949e] hover:text-white'
                }`}
              >
                <Code className="w-3.5 h-3.5" /> Source View
              </button>
              <button 
                onClick={() => { setSelectedFile(null); setActiveTab('readme'); }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 ${
                  activeTab === 'readme' ? 'bg-[#21262d] text-white' : 'text-[#8b949e] hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" /> README.md
              </button>
              <button 
                onClick={() => { setSelectedFile(null); setActiveTab('vnc_guide'); }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 ${
                  activeTab === 'vnc_guide' ? 'bg-[#21262d] text-white' : 'text-[#8b949e] hover:text-white font-bold text-[#58a6ff]'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-[#58a6ff]" /> Cloud VNC Desktop Guide
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#8b949e] font-mono">
              <GitBranch className="w-3.5 h-3.5 text-[#58a6ff]" /> main
            </div>
          </div>

          {/* File Viewer Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#090d13] font-mono text-sm leading-relaxed">
            {activeTab === 'code' ? (
              <div className="relative">
                <div className="absolute top-2 right-2 text-xs bg-[#21262d] px-2 py-1 rounded border border-[#30363d] text-[#8b949e]">
                  {selectedFile ? 'editable simulation' : 'README.md'}
                </div>
                <pre className="text-[#79c0ff] whitespace-pre-wrap select-text text-xs overflow-x-auto leading-6">
                  {getFileContent()}
                </pre>
              </div>
            ) : activeTab === 'readme' ? (
              <div className="prose prose-invert max-w-none text-[#c9d1d9] font-sans text-sm space-y-4">
                <h1 className="text-xl font-bold text-white border-b border-[#30363d] pb-2 flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-[#2ea043]" /> Virtual Network Stream grabber
                </h1>
                <p className="text-sm text-[#8b949e]">
                  A high-fidelity chromium simulator showing the full, multi-part media segmentation, download and Google Drive synchronization stack.
                </p>
                <h2 className="text-base font-bold text-white pt-2">⚙️ Complete Step-by-Step Instructions</h2>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>
                    Run the <strong>Launch Virtual Chrome</strong> desktop sandbox container using the green button.
                  </li>
                  <li>
                    Navigate to the <strong>Chrome Web Store</strong> via the default tab in the virtual Chrome browser.
                  </li>
                  <li>
                    Search for and click <strong>Add to Chrome</strong> on the <em>Teams Recording & segment Stream Downloader</em>.
                  </li>
                  <li>
                    Navigate to the <strong>Microsoft Teams</strong> tab, play the recording, and trigger a download of the virtual video file.
                  </li>
                  <li>
                    Once downloaded, use the <strong>Google Drive Transfer Tool</strong> built into the Virtual Chrome browser to upload the custom recording segment to your Google Drive!
                  </li>
                </ol>
                <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-lg mt-4 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-[#58a6ff] font-bold text-sm">Google Drive Permissions Ready</h3>
                    <p className="text-xs text-[#8b949e] mt-1">The app holds valid authorized Google OAuth keys. You can do a real file upload directly to your Drive!</p>
                  </div>
                  <button 
                    onClick={onLaunchBrowser}
                    className="bg-[#2ea043] hover:bg-[#2ea043]/90 text-white text-xs px-3 py-2 rounded-md font-bold transition-all"
                  >
                    Launch Now
                  </button>
                </div>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none text-[#c9d1d9] font-sans text-sm space-y-5">
                <h1 className="text-xl font-bold text-white border-b border-[#30363d] pb-2 flex items-center gap-2 text-[#58a6ff]">
                  <Cpu className="w-6 h-6" /> Cloud Developer Desktops & The Bandwidth Hack
                </h1>
                
                <p className="text-sm text-[#c9d1d9] leading-relaxed">
                  You requested details on how software development cloud virtual machines can be transformed into robust, browser-accessible, high-speed graphical desktops. Here is a comprehensive overview of how this concept operates in real-world scenarios:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-lg space-y-2">
                    <h3 className="text-white font-bold text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                      🖥️ Graphical Cloud Desktops (VNC)
                    </h3>
                    <p className="text-[#8b949e] text-xs leading-relaxed">
                      Platforms like <strong>GitHub Codespaces</strong> and <strong>Gitpod</strong> give developers fully featured Linux servers out-of-the-box (with up to <strong>60 free hours a month</strong>). Since they default to a text terminal, developers use lightweight <strong>desktop-lite templates (NoVNC)</strong>. This serves a full graphical XFCE Linux desktop through a standard HTTP port that loads right inside a browser tab!
                    </p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-lg space-y-2">
                    <h3 className="text-white font-bold text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      ⚡ The Gigabit Bandwidth Hack
                    </h3>
                    <p className="text-[#8b949e] text-xs leading-relaxed">
                      Unlike your home internet where uploading large files can take hours due to asymmetric connection speeds, cloud coding environments sit on <strong>enterprise high-speed gigabit backbones</strong>, typically inside Azure (for Codespaces) or AWS. Downloading multi-gigabyte Teams stream recordings and instantly piping them to Google Drive takes literally seconds!
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-indigo-500/[0.03] border border-indigo-500/20 rounded-lg space-y-3">
                  <h3 className="text-indigo-400 font-bold text-sm">🛠️ How to set it up yourself:</h3>
                  <ol className="list-decimal pl-5 text-xs text-gray-300 space-y-2 leading-relaxed">
                    <li>
                      Create a standard GitHub repository with the <strong className="text-white font-mono font-normal">.devcontainer/devcontainer.json</strong> file in your directory tree. We have pre-configured a sample production-ready file for you! Simply select and duplicate it from the file browser panel on the left.
                    </li>
                    <li>
                      Launch a new <strong>Codespace</strong> in your GitHub repository.
                    </li>
                    <li>
                      When the terminal loads, a popup on the bottom-right will announce <em>"Active Port 6080 Forwarded"</em>. Click <strong>Open in Browser</strong>.
                    </li>
                    <li>
                      You will instantly see a full Linux desktop interface inside a browser tab! Launch the built-in Chromium browser, add any extensions, play the target Microsoft Teams video, download the MP4 file to local container storage, and drag-and-drop it to Google Drive in seconds.
                    </li>
                  </ol>
                </div>

                <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white">Experience Virtual Chrome Sandbox Now</h3>
                    <p className="text-xs text-[#8b949e]">Switch to the interactive simulation of the VNC Chrome tab to see how Extensions and Cloud backdoors operate.</p>
                  </div>
                  <button 
                    onClick={onLaunchBrowser}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded-lg font-bold transition-all self-start sm:self-auto shrink-0 shadow-lg shadow-indigo-600/10"
                  >
                    Open Virtual Chrome
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
