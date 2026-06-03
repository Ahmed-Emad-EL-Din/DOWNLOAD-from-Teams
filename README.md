# 🖥️ Virtual Chrome Desktop & Drive Transporter 📦

> **The Gigabit Bandwidth Hack:** Move gigabytes of Microsoft Teams recordings, video files, or heavy assets directly into Google Drive in literally seconds. 

This repository is designed to give you a **complete, browser-accessible, high-speed graphical Linux desktop** hosted entirely in the cloud (like GitHub Codespaces or Gitpod—up to 60 free hours per month). 

By exploiting these cloud developer machines connected directly to multi-gigabit enterprise fiber backbones in Azure or AWS datacenters, you can download files and backup heavy recordings at server-to-server speed, bypassing local ISP upload caps and saving your home bandwidth.

---

## 🛠️ Step-by-Step Setup Guide

Follow these exact steps to launch your virtual desktop and get Google Chrome running inside it:

### 1. File Configuration
Ensure your repository contains the following `.devcontainer/devcontainer.json` configuration file:

```json
{
  "name": "Virtual Chromium NoVNC Sandbox",
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu",
  "containerEnv": {
    "DISPLAY": ":1"
  },
  "features": {
    "ghcr.io/devcontainers/features/desktop-lite:1": {
      "version": "latest",
      "vncPassword": "password"
    }
  },
  "forwardPorts": [6080, 5901],
  "portsAttributes": {
    "6080": {
      "label": "Virtual Desktop UI VNC",
      "onAutoForward": "openBrowser"
    }
  },
  "postCreateCommand": "sudo apt-get update && sudo apt-get install -y wget && wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && sudo apt-get install -y ./google-chrome-stable_current_amd64.deb && rm google-chrome-stable_current_amd64.deb && echo 'Google Chrome successfully installed!'"
}
```

### 2. Launch the Cloud Server (e.g., GitHub Codespaces)
1. Commit and push these files to your GitHub repository (named `virtual-chrome-desktop`).
2. Click the green **"Code"** button on GitHub, switch to the **"Codespaces"** tab, and click **"Create codespace on main"**.
3. Wait about 30–45 seconds for the lightweight Ubuntu image to pull and finalize.

### 3. Open the Virtual Desktop Viewer
1. When the container boots, VS Code will display a notification on the bottom-right: **"Active Port 6080 Forwarded"**.
2. Click **Open in Browser** (or navigate to your editor's "Ports" tab, locate port `6080`, and click the Globe icon).
3. A new tab will open displaying the **NoVNC Interface**. Click the **Connect** button.
4. When prompted for a password, enter: `password`.

---

## 🖥️ Installing & Running Google Chrome

Ubuntu's default `chromium-browser` package is just a redirection wrapper to Ubuntu **snaps**. However, unprivileged Docker containers (like GitHub Codespaces or Gitpod) are blocked from running **snapd** services—which results in a blank desktop screen if you try to use it.

To resolve this, we install the **official standalone Google Chrome browser** (which runs perfectly without snaps).

### Launching Chrome on display `:1`
Open your VS Code / Codespaces bottom **Terminal** panel, and copy-paste this multi-stage command to trigger a clean installation and launch Google Chrome redirected straight to your VNC graphic display:

```bash
sudo apt-get update && sudo apt-get install -y wget && wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && sudo apt-get install -y ./google-chrome-stable_current_amd64.deb && rm google-chrome-stable_current_amd64.deb && export DISPLAY=:1 && google-chrome --no-sandbox --disable-dev-shm-usage &
```

> 💡 **Tip:** If the installation is already finished, you can simply run this whenever you want to re-launch Chrome:
> ```bash
> export DISPLAY=:1 && google-chrome --no-sandbox --disable-dev-shm-usage &
> ```

---

## 🚀 Transferring Microsoft Teams Videos to Google Drive

Once Google Chrome is active on your virtual desktop screen inside your NoVNC tab:

1. **Install the Downloader Extension:**
   Open Google Chrome inside your NoVNC window, navigate to the following link, and click **Add to Chrome** to install the extension:
   👉 **[MS Teams Video/Transcript Downloader](https://chromewebstore.google.com/detail/ms-teams-video-transcript/hmljlkhcebhkkhbbafiheolbneecoinp)**

2. **Download Teams Streams:**
   In the virtual Chrome browser, open a tab to `teams.microsoft.com` or your recording link. When playing your recording, let the extension capture the media segments and assemble them high-speed to your guest machine's virtual storage.

3. **Synchronize directly to Google Drive:**
   Open `drive.google.com` in your virtual Chrome browser, log in, and drag the downloaded MP4 file from your downloads history direct to your Google Drive account. Enjoy multi-gigabit upload speed!
