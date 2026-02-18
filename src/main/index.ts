import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { spawn, spawnSync, ChildProcessWithoutNullStreams } from 'child_process'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import fs from 'fs'
import icon from '../../resources/icon.png?asset'

let pythonProcess: ChildProcessWithoutNullStreams | null = null

// 🚀 Function to start Python server
function startPythonServer(): void {
  let scriptPath: string
  let command: string
  let args: string[]

  if (is.dev) {
    // 🔧 In Development: Run from source
    const pythonDir = join(__dirname, '..', '..', 'python-server')
    const venvDir = join(pythonDir, 'venv')
    const pythonExec = join(venvDir, 'bin', 'python3')
    scriptPath = join(pythonDir, 'main.py')

    console.log('🔧 Development Config:')
    console.log(`   Python: ${pythonExec}`)
    console.log(`   Script: ${scriptPath}`)

    // 🏗️ Auto-setup if venv is missing
    if (!fs.existsSync(pythonExec)) {
      console.log('⚠️ Python virtual environment not found. Attempting auto-setup...')
      const buildScript = join(pythonDir, 'build-server.sh')

      if (fs.existsSync(buildScript)) {
        console.log('🏗️ Running build-server.sh...')
        const result = spawnSync('bash', [buildScript], {
          cwd: pythonDir,
          stdio: 'inherit'
        })

        if (result.status !== 0) {
          console.error('❌ Auto-setup failed. Please run ./build-server.sh manually.')
          return
        }
        console.log('✅ Auto-setup complete.')
      } else {
        console.error('❌ build-server.sh not found. Cannot auto-setup.')
        return
      }
    }

    command = pythonExec
    args = [scriptPath]
  } else {
    // 📦 In Production: Run bundled executable
    const executableName = 'cognifold-server'
    // In production, resources are typically in process.resourcesPath
    scriptPath = join(process.resourcesPath, executableName)

    console.log('📦 Production Config:')
    console.log(`   Resources Path: ${process.resourcesPath}`)
    console.log(`   Executable Path: ${scriptPath}`)

    const fileExists = fs.existsSync(scriptPath)
    console.log(`   Binary Exists? ${fileExists ? 'YES' : 'NO'}`)

    if (!fileExists) {
      console.error('❌ Critical: Python executable not found in resources!')
    }

    command = scriptPath
    args = []
  }

  console.log('🚀 Starting Python server...')
  pythonProcess = spawn(command, args, {
    stdio: ['ignore', 'pipe', 'pipe'], // capture output
  }) as unknown as ChildProcessWithoutNullStreams

  if (pythonProcess.stdout) {
    pythonProcess.stdout.on('data', (data) => {
      console.log(`🐍 Python: ${data}`)
    })
  }

  if (pythonProcess.stderr) {
    pythonProcess.stderr.on('data', (data) => {
      console.log(`🐍 Python: ${data}`)
    })
  }

  pythonProcess.on('close', (code) => {
    console.log(`🔚 Python server exited with code ${code}`)
  })

  pythonProcess.on('error', (err) => {
    console.error('❌ Failed to start Python server', err)
  })
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    show: false,
    title: '',
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// 🧠 Main App
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')
  app.on('browser-window-created', (_, window) => optimizer.watchWindowShortcuts(window))

  // Start Python server automatically
  startPythonServer()

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (pythonProcess) {
    pythonProcess.kill()
  }
  if (process.platform !== 'darwin') app.quit()
})