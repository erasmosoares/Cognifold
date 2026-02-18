"use strict";
const electron = require("electron");
const path = require("path");
const child_process = require("child_process");
const utils = require("@electron-toolkit/utils");
const fs = require("fs");
const icon = path.join(__dirname, "../../resources/icon.png");
let pythonProcess = null;
function startPythonServer() {
  let scriptPath;
  let command;
  let args;
  if (utils.is.dev) {
    const pythonDir = path.join(__dirname, "..", "..", "python-server");
    const venvDir = path.join(pythonDir, "venv");
    const pythonExec = path.join(venvDir, "bin", "python3");
    scriptPath = path.join(pythonDir, "main.py");
    console.log("🔧 Development Config:");
    console.log(`   Python: ${pythonExec}`);
    console.log(`   Script: ${scriptPath}`);
    if (!fs.existsSync(pythonExec)) {
      console.log("⚠️ Python virtual environment not found. Attempting auto-setup...");
      const buildScript = path.join(pythonDir, "build-server.sh");
      if (fs.existsSync(buildScript)) {
        console.log("🏗️ Running build-server.sh...");
        const result = child_process.spawnSync("bash", [buildScript], {
          cwd: pythonDir,
          stdio: "inherit"
        });
        if (result.status !== 0) {
          console.error("❌ Auto-setup failed. Please run ./build-server.sh manually.");
          return;
        }
        console.log("✅ Auto-setup complete.");
      } else {
        console.error("❌ build-server.sh not found. Cannot auto-setup.");
        return;
      }
    }
    command = pythonExec;
    args = [scriptPath];
  } else {
    const executableName = "cognifold-server";
    scriptPath = path.join(process.resourcesPath, executableName);
    console.log("📦 Production Config:");
    console.log(`   Resources Path: ${process.resourcesPath}`);
    console.log(`   Executable Path: ${scriptPath}`);
    const fileExists = fs.existsSync(scriptPath);
    console.log(`   Binary Exists? ${fileExists ? "YES" : "NO"}`);
    if (!fileExists) {
      console.error("❌ Critical: Python executable not found in resources!");
    }
    command = scriptPath;
    args = [];
  }
  console.log("🚀 Starting Python server...");
  pythonProcess = child_process.spawn(command, args, {
    stdio: ["ignore", "pipe", "pipe"]
    // capture output
  });
  if (pythonProcess.stdout) {
    pythonProcess.stdout.on("data", (data) => {
      console.log(`🐍 Python: ${data}`);
    });
  }
  if (pythonProcess.stderr) {
    pythonProcess.stderr.on("data", (data) => {
      console.log(`🐍 Python: ${data}`);
    });
  }
  pythonProcess.on("close", (code) => {
    console.log(`🔚 Python server exited with code ${code}`);
  });
  pythonProcess.on("error", (err) => {
    console.error("❌ Failed to start Python server", err);
  });
}
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    width: 1600,
    height: 900,
    show: false,
    title: "",
    autoHideMenuBar: true,
    ...process.platform === "linux" ? { icon } : {},
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: true
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => utils.optimizer.watchWindowShortcuts(window));
  startPythonServer();
  createWindow();
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (pythonProcess) {
    pythonProcess.kill();
  }
  if (process.platform !== "darwin") electron.app.quit();
});
