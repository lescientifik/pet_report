/**
 * Puppeteer browser management utilities
 */

import puppeteer from 'puppeteer'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync, mkdirSync, writeFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const SCREENSHOTS_DIR = join(__dirname, '../screenshots')

// Ensure screenshots directory exists
if (!existsSync(SCREENSHOTS_DIR)) {
  mkdirSync(SCREENSHOTS_DIR, { recursive: true })
}

let screenshotCounter = 0

/**
 * Launch Puppeteer browser
 */
export async function launchBrowser() {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  })

  const page = await browser.newPage()

  // Set viewport
  await page.setViewport({
    width: 1280,
    height: 800,
    deviceScaleFactor: 1
  })

  // Collect console logs and errors
  const consoleLogs = []

  page.on('console', msg => {
    const type = msg.type()
    const text = msg.text()

    consoleLogs.push({
      type,
      text,
      timestamp: Date.now()
    })

    // Log to terminal for debugging
    if (type === 'error' || type === 'warning') {
      console.log(`   [Browser ${type}]:`, text)
    }
  })

  page.on('pageerror', error => {
    consoleLogs.push({
      type: 'pageerror',
      text: error.toString(),
      timestamp: Date.now()
    })
    console.log(`   [Page Error]:`, error.toString())
  })

  // Attach console logs to page object for access in tests
  page._consoleLogs = consoleLogs

  return { browser, page }
}

/**
 * Close browser
 */
export async function closeBrowser(browser) {
  if (browser) {
    await browser.close()
  }
}

/**
 * Take screenshot with auto-incrementing filename
 */
export async function takeScreenshot(page, name) {
  screenshotCounter++
  const timestamp = Date.now()
  const filename = `${screenshotCounter.toString().padStart(3, '0')}-${name}-${timestamp}.png`
  const filepath = join(SCREENSHOTS_DIR, filename)

  await page.screenshot({
    path: filepath,
    fullPage: true
  })

  return { filename, filepath }
}

/**
 * Navigate to URL with error handling
 */
export async function navigateToUrl(page, url, options = {}) {
  const defaultOptions = {
    waitUntil: 'networkidle2',
    timeout: 30000
  }

  try {
    await page.goto(url, { ...defaultOptions, ...options })
  } catch (error) {
    throw new Error(`Failed to navigate to ${url}: ${error.message}`)
  }
}

/**
 * Wait for selector with timeout
 */
export async function waitForSelector(page, selector, timeout = 5000) {
  try {
    await page.waitForSelector(selector, { timeout })
  } catch (error) {
    throw new Error(`Selector "${selector}" not found within ${timeout}ms`)
  }
}

/**
 * Click element safely
 */
export async function clickElement(page, selector, timeout = 5000) {
  await waitForSelector(page, selector, timeout)
  await page.click(selector)
}

/**
 * Click element by text content (searches buttons, divs, and other clickable elements)
 */
export async function clickElementByText(page, text, timeout = 5000) {
  try {
    // Wait for element to exist
    await page.waitForFunction(
      (searchText) => {
        const selectors = ['button', '.cancer-card', '.indication-option', '[role="button"]', '.clickable', 'div']
        for (const selector of selectors) {
          const elements = Array.from(document.querySelectorAll(selector))
          const match = elements.find(el => {
            const textContent = el.textContent.trim()
            return textContent.includes(searchText)
          })
          if (match) return true
        }
        return false
      },
      { timeout },
      text
    )

    // Click the element
    const clicked = await page.evaluate((searchText) => {
      const selectors = ['button', '.cancer-card', '.indication-option', '[role="button"]', '.clickable', 'div']
      for (const selector of selectors) {
        const elements = Array.from(document.querySelectorAll(selector))
        const match = elements.find(el => {
          const textContent = el.textContent.trim()
          return textContent.includes(searchText)
        })
        if (match) {
          console.log(`Found element with text "${searchText}" using selector "${selector}"`)
          match.click()
          return true
        }
      }
      return false
    }, text)

    if (!clicked) {
      throw new Error(`Could not click element with text "${text}"`)
    }

    // Small delay after click for UI to update
    await new Promise(resolve => setTimeout(resolve, 100))
  } catch (error) {
    throw new Error(`Element with text "${text}" not found within ${timeout}ms`)
  }
}

/**
 * Type text safely
 */
export async function typeText(page, selector, text, timeout = 5000) {
  await waitForSelector(page, selector, timeout)
  await page.type(selector, text)
}

/**
 * Get console errors from page (excluding 404 errors which are not critical)
 */
export function getConsoleErrors(page) {
  return page._consoleLogs.filter(log => {
    if (log.type !== 'error' && log.type !== 'pageerror') return false
    // Ignore 404 errors (favicon, etc.)
    if (log.text.includes('404') || log.text.includes('Failed to load resource')) return false
    return true
  })
}

/**
 * Clear console logs
 */
export function clearConsoleLogs(page) {
  page._consoleLogs = []
}

/**
 * Reset screenshot counter (called at start of each test)
 */
export function resetScreenshotCounter() {
  screenshotCounter = 0
}

/**
 * Reset the app by clicking the reset button
 */
export async function resetApp(page) {
  try {
    // Try to click reset button if it exists
    const resetButton = await page.$('[data-testid="btn-reset"]')
    if (resetButton) {
      await resetButton.click()
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  } catch (error) {
    // Ignore if button doesn't exist yet
  }
}
