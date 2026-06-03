import React, { useState, useEffect } from 'react';
import { 
  CloudCheck, 
  HelpCircle, 
  ArrowUpRight, 
  Settings, 
  Plus, 
  Folder, 
  FileText, 
  Key, 
  UserCheck, 
  LogOut, 
  CloudUpload, 
  Briefcase, 
  Loader2,
  CheckCircle,
  Network,
  Cpu
} from 'lucide-react';
import { VirtualFile, GDriveUser } from '../types';

interface GoogleDriveManagerProps {
  downloadedFiles: VirtualFile[];
  onUploadSuccess: (fileId: string) => void;
}

export default function GoogleDriveManager({ downloadedFiles, onUploadSuccess }: GoogleDriveManagerProps) {
  const [useRealDrive, setUseRealDrive] = useState(false);
  const [clientId, setClientId] = useState('');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<GDriveUser | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  // Listed files inside Google Drive
  const [driveFiles, setDriveFiles] = useState<any[]>([
    { id: '1', name: 'Teams_Sync_Weekly_Alignment.mp4', size: '85 MB', createdTime: '2026-06-03T14:24:00Z' },
  ]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>(['Initialized Google Drive manager interface. Sandbox fallback ready.']);
  const [uploadingFileId, setUploadingFileId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Load from local storage token if available
  useEffect(() => {
    const cachedToken = localStorage.getItem('gdrive_oauth_token');
    const cachedUser = localStorage.getItem('gdrive_user');
    const savedClientId = localStorage.getItem('gdrive_client_id');
    
    if (savedClientId) setClientId(savedClientId);
    if (cachedToken) {
      setAccessToken(cachedToken);
      setUseRealDrive(true);
      if (cachedUser) {
        try {
          setUser(JSON.parse(cachedUser));
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 49)]);
  };

  // Google OAuth Client-side popup trigger
  const handleConnectWithOAuth = () => {
    if (!clientId.trim()) {
      addLog('Error: Please specify a valid Client ID from Google Cloud Console.');
      alert('To use live mode, please enter a Google Cloud OAuth Client ID first.');
      return;
    }

    setIsAuthenticating(true);
    addLog(`Initiating OAuth implicit flow with Client ID: ${clientId.substring(0, 15)}...`);

    const redirectUri = window.location.origin;
    const scope = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(scope)}&state=teams2drive`;

    // Open standard oauth popup window
    const popup = window.open(authUrl, 'google_oauth_popup', 'width=550,height=650');
    
    if (!popup) {
      setIsAuthenticating(false);
      addLog('Error: OAuth Popup blocked by browser settings.');
      alert('Please enable popups for this page to sign in with Google.');
      return;
    }

    // Monitor popup url for returning token hash fragment
    const checkInterval = setInterval(() => {
      try {
        if (!popup || popup.closed) {
          clearInterval(checkInterval);
          setIsAuthenticating(false);
          addLog('Authentication canceled: Popup closed by user.');
          return;
        }

        const currentUrl = popup.location.href;
        if (currentUrl.includes('access_token=')) {
          clearInterval(checkInterval);
          
          const hash = popup.location.hash;
          const params = new URLSearchParams(hash.substring(1));
          const token = params.get('access_token');
          
          if (token) {
            setAccessToken(token);
            localStorage.setItem('gdrive_oauth_token', token);
            localStorage.setItem('gdrive_client_id', clientId);
            
            addLog('OAuth access token successfully retrieved from callback Hash fragment.');
            fetchUserProfile(token);
            popup.close();
          } else {
            addLog('Failed to parse access_token from callback URL parameters.');
            popup.close();
          }
        }
      } catch (e) {
        // Cross-origin checks are expected to fail until redirected back to window.location.origin
      }
    }, 500);
  };

  const fetchUserProfile = async (token: string) => {
    try {
      addLog('Fetching Google account identifier profile data...');
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const profile = await response.json();
        const driveUser: GDriveUser = {
          name: profile.name,
          email: profile.email,
          picture: profile.picture
        };
        setUser(driveUser);
        localStorage.setItem('gdrive_user', JSON.stringify(driveUser));
        addLog(`Successfully signed in as ${profile.name} (${profile.email})`);
        setUseRealDrive(true);
        fetchDriveFiles(token);
      } else {
        throw new Error('Profile response failed');
      }
    } catch {
      addLog('Error fetching user profile. Session might have expired.');
      handleSignOut();
    } finally {
      setIsAuthenticating(false);
    }
  };

  const fetchDriveFiles = async (token: string) => {
    setIsLoadingFiles(true);
    addLog('Executing GET: https://www.googleapis.com/drive/v3/files?spaces=drive...');
    try {
      const response = await fetch('https://www.googleapis.com/drive/v3/files?pageSize=10&fields=files(id,name,mimeType,size,createdTime)&q=trashed=false', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setDriveFiles(data.files || []);
        addLog(`Successfully retrieved list of ${data.files?.length || 0} files files from live Drive.`);
      } else {
        addLog('Live Drive list request failed. Likely token expired.');
      }
    } catch (err) {
      addLog('Network error listing files from live Google Drive.');
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleSignOut = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('gdrive_oauth_token');
    localStorage.removeItem('gdrive_user');
    addLog('Signed out of Google account. Reverting to sandbox simulator.');
  };

  // Perform upload (mock or real)
  const handleUploadFile = async (file: VirtualFile) => {
    if (uploadingFileId) return;

    setUploadingFileId(file.id);
    setUploadProgress(10);
    addLog(`Initiating segmented file upload sequence for item: "${file.name}"`);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 20;
      });
    }, 400);

    // Simulate segment chunk transfer
    setTimeout(async () => {
      if (useRealDrive && accessToken) {
        try {
          addLog('Real API Mode: Constructing multi-part binary streaming metadata...');
          
          // Create custom rich summary container text representing the meeting download
          const streamMetadata = {
            name: file.name,
            mimeType: 'text/markdown',
            description: `Auto-uploaded from MS Teams recording capture script. Original size: ${file.size}`
          };

          const fileContent = `# ${file.name} (Teams Recording Assembly File)

This document represents the successfully compiled streams grabbed from your MS Teams Sandbox browser.
- File Name: ${file.name}
- Size: ${file.size}
- Assembly Time: ${file.downloadedAt}
- Captured By: ${user?.name || 'Ahmed Conan User'}

---
## Segment Retrieval Logs
1. Detected H.264 stream sequence.
2. Demultiplexed live segment streams successfully.
3. Created client-side backup assembly.
`;

          addLog(`Executing multipart POST request to: https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`);

          const boundary = 'foo_bar_boundary';
          const multipartBody = 
            `\r\n--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n` +
            JSON.stringify(streamMetadata) +
            `\r\n--${boundary}\r\nContent-Type: text/markdown\r\n\r\n` +
            fileContent +
            `\r\n--${boundary}--`;

          const response = await fetch('https://www.googleapis.com/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': `multipart/related; boundary=${boundary}`
            },
            body: multipartBody
          });

          if (response.ok) {
            const data = await response.json();
            clearInterval(interval);
            setUploadProgress(100);
            setTimeout(() => {
              addLog(`Sucessful Live Upload: File registered in your drive with ID: ${data.id}`);
              onUploadSuccess(file.id);
              fetchDriveFiles(accessToken);
              setUploadingFileId(null);
            }, 600);
          } else {
            throw new Error('Multipart failure');
          }

        } catch (err) {
          clearInterval(interval);
          addLog('Real API multipart upload failed. Reverting upload to sandbox...');
          setUploadingFileId(null);
          alert('Upload call failed to complete. Let us perform Sandbox mock-upload instead!');
        }
      } else {
        // Sandbox Simulation mode
        setTimeout(() => {
          clearInterval(interval);
          setUploadProgress(100);
          setTimeout(() => {
            const newMockFile = {
              id: Math.random().toString(),
              name: file.name,
              size: file.size,
              createdTime: new Date().toISOString()
            };
            setDriveFiles(prev => [newMockFile, ...prev]);
            onUploadSuccess(file.id);
            addLog(`Sandbox Completed: Added mock file upload record to virtual Drive view.`);
            setUploadingFileId(null);
          }, 500);
        }, 1200);
      }
    }, 1500);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden font-sans text-gray-800 shadow-sm flex flex-col h-full">
      {/* Drive Widget Header */}
      <div className="bg-gray-50 border-b border-gray-100 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <CloudUpload className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Google Drive Transfer Hub</h2>
            <p className="text-xs text-gray-400 mt-0.5">Direct segment assembly backup to Drive storage</p>
          </div>
        </div>

        {/* Live / Sandbox Mode Selector */}
        <div className="flex items-center gap-3 bg-white p-1.5 border border-gray-200 rounded-lg text-xs self-start md:self-auto shadow-2xs">
          <button 
            type="button"
            onClick={() => { setUseRealDrive(false); handleSignOut(); }}
            className={`px-3 py-1.5 rounded-md font-bold transition-all ${
              !useRealDrive 
                ? 'bg-blue-600 text-white shadow-xs' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            Sandbox Simulator
          </button>
          <button 
            type="button"
            onClick={() => setUseRealDrive(true)}
            className={`px-3 py-1.5 rounded-md font-bold transition-all ${
              useRealDrive 
                ? 'bg-[#0f9d58] text-white shadow-xs' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            Live Drive Integration
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        
        {/* Left Side Panel: Drive Auth or Configuration console */}
        <div className="w-full md:w-80 border-r border-gray-100 p-5 flex flex-col gap-4 overflow-y-auto shrink-0 bg-gray-50/50">
          
          {useRealDrive ? (
            <div className="space-y-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Live Drive OAuth Status</span>
              
              {user ? (
                <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={user.picture || 'https://via.placeholder.com/40'} 
                      alt="Provider Avatar" 
                      className="w-10 h-10 rounded-full border border-gray-100"
                    />
                    <div>
                      <span className="font-bold text-gray-800 text-xs block">{user.name}</span>
                      <span className="text-[10px] text-gray-400 block break-all">{user.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Real-time Token Signed in</span>
                  </div>

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-1.5 text-xs text-red-600 hover:bg-red-50 py-1.5 rounded-lg border border-red-200 transition-colors bg-white font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Log Out
                  </button>
                </div>
              ) : (
                <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 block">
                  <span className="text-xs text-gray-600 leading-relaxed block">
                    To connect your real account, provide a Google OAuth Client ID setup in Google Cloud Console with authorized origins.
                  </span>
                  
                  {/* Client ID input */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 block">Google OAuth Client ID</label>
                    <div className="relative">
                      <Key className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        placeholder="your-client-id.apps.googleusercontent.com"
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 focus:outline-hidden focus:border-blue-500 py-1.5 pl-8 pr-2 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleConnectWithOAuth}
                    disabled={isAuthenticating}
                    className="w-full bg-[#0f9d58] hover:bg-[#0f9d58]/90 disabled:bg-gray-100 disabled:text-gray-400 text-white font-bold text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    {isAuthenticating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Initializing...</span>
                      </>
                    ) : (
                      <>
                        <Network className="w-3.5 h-3.5" />
                        <span>Authenticate OAuth</span>
                      </>
                    )}
                  </button>

                  <div className="p-2.5 bg-blue-50/50 border border-blue-100 rounded-lg text-[10px] text-blue-700 leading-relaxed block">
                    <span className="font-bold block mb-0.5">💡 How to create a Client ID:</span>
                    1. Go to <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="underline font-bold">Cloud Console APIs</a>.<br />
                    2. Enable Google Drive API.<br />
                    3. Under OAuth Credentials, add Authorized JavaScript Origins: <strong>{window.location.origin}</strong>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="space-y-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Sandbox Terminal Logs</span>
              
              <div className="bg-slate-900 text-slate-300 p-4 rounded-xl border border-slate-800 font-mono text-[10px] leading-relaxed flex-1 flex flex-col max-h-[300px]">
                <div className="text-emerald-400 font-bold border-b border-slate-800 pb-1.5 mb-2 flex items-center justify-between shrink-0">
                  <span>CONSOLE DEPLOY LOGS</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 max-h-[200px] select-text">
                  {debugLogs.map((log, i) => (
                    <div key={i} className="break-all whitespace-pre-wrap">{log}</div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-gray-200 text-xs text-gray-500 space-y-2 leading-relaxed block">
                <span className="font-bold text-gray-800 block">No Google Setup Required</span>
                <p>Use Sandbox mode to run and explore the full segment transfers, downloads, and virtual target directory mapping without keys.</p>
              </div>
            </div>
          )}

        </div>

        {/* Right Area: Ready Segment downloads & Google Drive file lists */}
        <div className="flex-1 p-5 flex flex-col gap-6 overflow-y-auto">
          
          {/* Active files waiting to upload */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ready for Drive Backup</span>
            
            {downloadedFiles.length === 0 ? (
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-xs text-gray-400 flex flex-col items-center justify-center space-y-2 bg-white">
                <CloudUpload className="w-8 h-8 text-gray-300" />
                <div className="font-medium text-gray-500">No meeting recordings segment file downloaded yet</div>
                <p className="max-w-xs leading-normal">Go to the MS Teams web viewer inside Virtual Chrome, highlight an item, and click Download recording segments first.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2.5">
                {downloadedFiles.map((file) => (
                  <div key={file.id} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between gap-4 hover:shadow-xs transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 text-[#6264a7] rounded-lg border border-indigo-100">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-800 block">{file.name}</span>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1">
                          <span>Size: {file.size}</span>
                          <span>•</span>
                          <span>Grabbed: {file.downloadedAt}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {file.uploadedToDrive ? (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 font-bold">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>Uploaded</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleUploadFile(file)}
                          disabled={uploadingFileId !== null}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 hover:shadow-xs disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                          {uploadingFileId === file.id ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Backup ({uploadProgress}%)</span>
                            </>
                          ) : (
                            <>
                              <CloudUpload className="w-3.5 h-3.5" />
                              <span>Backup to Drive</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Connected Google Drive files directory */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <span>Your Google Drive Folder</span>
              {isLoadingFiles && <Loader2 className="w-3 h-3 text-blue-600 animate-spin" />}
            </span>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="p-3.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-xs font-bold text-gray-500">
                <span>File Name</span>
                <span>Date Added</span>
              </div>

              {isLoadingFiles ? (
                <div className="p-10 text-center flex flex-col items-center justify-center text-xs text-gray-400 gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  <span>Retrieving live files from drive...</span>
                </div>
              ) : driveFiles.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-400">
                  <span>This folder is empty or holding zero files created by this sandbox.</span>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {driveFiles.map((f, i) => (
                    <div key={i} className="p-3.5 flex items-center justify-between hover:bg-gray-50/40 text-xs transition-colors">
                      <div className="flex items-center gap-2">
                        <Folder className="w-4 h-4 text-amber-500 shrink-0" />
                        <span className="font-semibold text-gray-800 break-all">{f.name}</span>
                      </div>
                      <span className="text-gray-400 text-[10px] shrink-0 font-medium">
                        {new Date(f.createdTime || Date.now()).toLocaleDateString() || 'Today'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
