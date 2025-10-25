/**
 * Dev server management utilities
 */

import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PROJECT_ROOT = join(__dirname, '../../../..')

const DEV_SERVER_URL = 'http://localhost:5173'
const MAX_WAIT_TIME = 30000 // 30s
const POLL_INTERVAL = 500 // 500ms

/**
 * Check if dev server is already running
 */
async function isServerRunning() {
  try {
    const response = await fetch(DEV_SERVER_URL)
    return response.ok
  } catch {
    return false
  }
}

/**
 * Wait for server to be ready
 */
async function waitForServer() {
  const startTime = Date.now()

  while (Date.now() - startTime < MAX_WAIT_TIME) {
    if (await isServerRunning()) {
      return true
    }
    await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL))
  }

  throw new Error(`Server did not start within ${MAX_WAIT_TIME}ms`)
}

/**
 * Start dev server
 */
async function startServer() {
  return new Promise((resolve, reject) => {
    console.log('   Starting Vite dev server...')

    const serverProcess = spawn('npm', ['run', 'dev'], {
      cwd: PROJECT_ROOT,
      shell: true,
      detached: false,
      stdio: 'pipe'
    })

    serverProcess.stdout.on('data', (data) => {
      const output = data.toString()
      if (output.includes('Local:') || output.includes('ready in')) {
        console.log('   Vite server started')
        resolve(serverProcess)
      }
    })

    serverProcess.stderr.on('data', (data) => {
      // Vite outputs to stderr sometimes, ignore unless it's an actual error
      const output = data.toString()
      if (output.includes('ERROR') || output.includes('EADDRINUSE')) {
        reject(new Error(output))
      }
    })

    serverProcess.on('error', reject)

    // Timeout fallback
    setTimeout(() => {
      resolve(serverProcess)
    }, 10000)
  })
}

/**
 * Ensure dev server is running (check or start)
 */
export async function ensureServerRunning() {
  if (await isServerRunning()) {
    console.log('   Dev server already running')
    return null
  }

  const serverProcess = await startServer()
  await waitForServer()

  return serverProcess
}
