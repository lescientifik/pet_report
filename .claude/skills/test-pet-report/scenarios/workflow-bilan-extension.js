/**
 * Test workflow: Bilan d'extension
 * Should skip treatment and TEP comparison steps
 */

import {
  navigateToUrl,
  takeScreenshot,
  clickElement,
  clickElementByText,
  typeText,
  waitForSelector,
  getConsoleErrors,
  resetScreenshotCounter
} from '../utils/browser.js'

export async function testWorkflowBilanExtension(page, reporter) {
  resetScreenshotCounter()
  const screenshots = []

  try {
    // Navigate to app
    await navigateToUrl(page, 'http://localhost:5173/pet_report/')
    await new Promise(resolve => setTimeout(resolve, 1000)) // Wait for Vue to mount

    // Step 1: Patient info (age + sex)
    await typeText(page, '[data-testid="age-input"]', '65')
    await clickElement(page, '[data-testid="btn-M"]')
    await clickElement(page, '[data-testid="btn-next-step"]')
    await new Promise(resolve => setTimeout(resolve, 800))

    // Step 2: Indication - select "bilan"
    await clickElement(page, '[data-testid="indication-bilan"]')
    await new Promise(resolve => setTimeout(resolve, 800))

    // Step 3: Cancer - select "Sein"
    await clickElement(page, '[data-testid="cancer-cancer du sein"]')
    await new Promise(resolve => setTimeout(resolve, 800))

    // Cancer details - select "gauche"
    await clickElement(page, '[data-testid="btn-gauche"]')
    await clickElement(page, '[data-testid="btn-next-step"]')
    await new Promise(resolve => setTimeout(resolve, 800))

    // Check current step is Results (not Treatment)
    const activeStep = await page.$eval('.form-step:not([style*="display: none"])', el => {
      return el.querySelector('h2')?.textContent || ''
    })

    if (!activeStep.includes('Résultats') && !activeStep.includes('résultats')) {
      const screenshot = await takeScreenshot(page, 'workflow-bilan-skip-fail')
      screenshots.push(screenshot)
      throw new Error(`Expected Results step after cancer selection, got: ${activeStep}`)
    }

    // Verify preview contains patient info and indication
    const finalPreview = await page.$eval('.preview-content', el => el.textContent)
    if (!finalPreview.includes('Patient de 65 ans') && !finalPreview.includes('65 ans')) {
      const screenshot = await takeScreenshot(page, 'preview-missing-patient-info')
      screenshots.push(screenshot)
      throw new Error('Preview should contain patient age information')
    }

    // Verify no console errors
    const consoleErrors = getConsoleErrors(page)
    if (consoleErrors.length > 0) {
      const screenshot = await takeScreenshot(page, 'console-errors')
      screenshots.push(screenshot)
      const error = new Error('Console errors detected')
      error.consoleErrors = consoleErrors
      throw error
    }

    reporter.recordPass('Workflow: Bilan d\'extension')

  } catch (error) {
    error.consoleErrors = getConsoleErrors(page)
    if (screenshots.length === 0) {
      screenshots.push(await takeScreenshot(page, 'final-error'))
    }
    reporter.recordFailure('Workflow: Bilan d\'extension', error, screenshots)
    throw error
  }
}
