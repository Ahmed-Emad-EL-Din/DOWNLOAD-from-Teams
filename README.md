# 🖥️ Virtual Chromium NoVNC Sandbox & Drive Transporter 📦

> **The Gigabit Bandwidth Hack:** Move gigabytes of Microsoft Teams recordings, video files, or heavy assets directly into Google Drive in literally seconds. 

This repository is designed to give you a **complete, browser-accessible, high-speed graphical Linux desktop** hosted entirely in the cloud. By exploiting the generous free developer hours offered by cloud hosting providers (like GitHub Codespaces or Gitpod—up to 60 free hours per month), anyone can command a robust Linux micro-server to bypass local ISP upload caps.

---

## ⚡ The Bandwidth Hack Explained

* **The Problem:** Moving a 2GB Microsoft Teams meeting recording to Google Drive from your laptop takes hours of slow upload speeds, eats your data plan, and hogs your bandwidth.
* **The Hack:** Your cloud developer machine is connected directly to multi-gigabit enterprise fiber backbones in data centers (AWS/Azure). Moving those same gigabytes of video takes seconds.
* **The Catch:** These server templates default to a text terminal console. This configuration uses **NoVNC** and **Desktop Lite** to boot up a full graphical desktop environment inside a separate browser tab, coupled with direct Google Chrome installation.

---

## 🛠️ Step-by-Step Setup Guide

Follow these exact steps to launch your virtual desktop and get Google Chrome running inside it:

### 1. File Configuration
Ensure your repository contains the following `.devcontainer/devcontainer.json` configuration file (already packaged inside this workspace):

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
1. Commit and push these files to your GitHub repository.
2. Click the green **"Code"** button on GitHub, switch to the **"Codespaces"** tab, and click **"Create codespace on main"**.
3. Wait about 30–45 seconds for the lightweight Ubuntu image to pull and finalize.

### 3. Open the Virtual Desktop Viewer
1. When the container boots, VS Code will display a notification on the bottom-right: **"Active Port 6080 Forwarded"**.
2. Click **Open in Browser** (or navigate to your editor's "Ports" tab, locate port `6080`, and click the Globe icon).
3. A new tab will open displaying the **NoVNC Interface**. Click the **Connect** button.
4. If prompted for a password, enter: `password`.

---

## 🔎 Troubleshooting: Fix White / Blank Canvas Issue
By default, Ubuntu's package manager tries to install Chromium as a **Snap package**. However, Docker and other unprivileged development containers block **snapd** services for security reasons—leaving you with a blank screen.

### The Fix: Install Standalone Google Chrome Stable (No Snaps)
If you get a blank white screen inside your NoVNC desktop view, run this command inside your GitHub Codespaces editor **Terminal** panel to install and execute real, un-sandboxed Google Chrome instantly:

```bash
sudo apt-get update && sudo apt-get install -y wget && wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && sudo apt-get install -y ./google-chrome-stable_current_amd64.deb && rm google-chrome-stable_current_amd64.deb && export DISPLAY=:1 && google-chrome --no-sandbox --disable-dev-shm-usage &
```

### What this terminal script does:
1. **Downloads the Official `.deb` file** directly from Google’s production stable servers.
2. **Installs all dependencies** and links binary paths cleanly inside Ubuntu.
3. Sets your graphic export environment dynamically to display index `:1`.
4. Launches **Google Chrome** fully un-sandboxed (required inside Docker layers) with shared memory buffers optimized.
5. **Instantly, Google Chrome will appear** alive and active inside your NoVNC browser viewer tab!

---

## 🚀 Transferring Microsoft Teams Videos to Google Drive
Once Chrome is active on your virtual desktop screen:
1. **Install Extensions:** Open the Chrome Web Store in your virtual browser and install the *Teams Video Stream Downloader* segment grabber extension.
2. **Download Stream:** Navigate to `teams.microsoft.com`, play your recorded meeting, and trigger the high-speed segment assembly to your virtual disk.
3. **Upload to Drive:** Open a browser tab to `drive.google.com`, log in, and drag the completed MP4 directly from your container's file explorer. Watch it upload to Google Drive at server backplane speeds!
