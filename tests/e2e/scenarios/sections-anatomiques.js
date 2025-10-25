/**
 * Test sections anatomiques: Normal et Anomalie (avec lésions cibles optionnelles)
 */

import {
  navigateToUrl,
  takeScreenshot,
  clickElement,
  typeText,
  waitForSelector,
  getConsoleErrors,
  resetScreenshotCounter
} from '../utils/browser.js'

export async function testSectionsAnatomiques(page, reporter) {
  resetScreenshotCounter()
  const screenshots = []

  try {
    // Start fresh and navigate to Results step quickly
    await page.goto('http://localhost:5173/pet_report/', { waitUntil: 'networkidle2' })
    // Clear localStorage to ensure fresh state
    await page.evaluate(() => localStorage.clear())
    await page.reload({ waitUntil: 'networkidle2' })
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Quick navigation to Results
    await typeText(page, '[data-testid="age-input"]', '70')
    await clickElement(page, '[data-testid="btn-M"]')
    await clickElement(page, '[data-testid="btn-next-step"]')
    await new Promise(resolve => setTimeout(resolve, 800))

    await clickElement(page, '[data-testid="indication-bilan"]')
    await new Promise(resolve => setTimeout(resolve, 800))

    await clickElement(page, '[data-testid="cancer-cancer du sein"]')
    await new Promise(resolve => setTimeout(resolve, 800))
    await clickElement(page, '[data-testid="btn-gauche"]')
    await clickElement(page, '[data-testid="btn-next-step"]')
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Should be on Results step now
    const currentStep = await page.$eval('.form-step:not([style*="display: none"])', el => {
      return el.querySelector('h2')?.textContent || ''
    })

    if (!currentStep.includes('Résultats') && !currentStep.includes('résultats')) {
      throw new Error(`Expected to be on Results step, got: ${currentStep}`)
    }

    // Test 1: Verify default mode is "Normal" for first section
    const normalPhrase = await page.$('.normal-phrase')
    if (!normalPhrase) {
      throw new Error('Normal phrase should be visible by default')
    }

    // Test 2: Switch to "Anomalie" mode
    await clickElement(page, '[data-testid="mode-anomalie"]')
    await new Promise(resolve => setTimeout(resolve, 500))

    // Check textarea is visible
    const textareaVisible = await page.$('textarea[placeholder*="anomalies"]')
    if (!textareaVisible) {
      const screenshot = await takeScreenshot(page, 'anomalie-textarea-missing')
      screenshots.push(screenshot)
      throw new Error('Anomalie textarea should be visible')
    }

    // Type some text
    await typeText(page, 'textarea', 'Hyperfixation cérébrale suspecte SUVmax 12.5')

    // Verify text appears in preview
    await new Promise(resolve => setTimeout(resolve, 500))
    let previewText = await page.$eval('.preview-content', el => el.textContent)
    if (!previewText.includes('Hyperfixation')) {
      throw new Error('Anomalie text should appear in preview')
    }

    // Test 3: Add lesion target in Anomalie mode (texte + lésions simultanés)
    // Verify lesion form is visible in Anomalie mode (always displayed)
    await new Promise(resolve => setTimeout(resolve, 500))

    const lesionLocInput = await page.$('[data-testid="lesion-localisation"]')
    if (!lesionLocInput) {
      const screenshot = await takeScreenshot(page, 'lesion-form-missing')
      screenshots.push(screenshot)
      throw new Error('Lesion form should be visible in Anomalie mode')
    }

    await typeText(page, '[data-testid="lesion-localisation"]', 'Cortex frontal droit')
    await typeText(page, '[data-testid="lesion-suvmax"]', '12.5')
    await typeText(page, '[data-testid="lesion-volume"]', '3.2')
    await new Promise(resolve => setTimeout(resolve, 500))

    // Click "Add" button to add the lesion
    const addButton = await page.$('.lesion-form .btn-primary')
    if (addButton) {
      await addButton.click()
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    // Verify both text AND lesion appear in preview
    previewText = await page.$eval('.preview-content', el => el.textContent)
    if (!previewText.includes('Hyperfixation')) {
      throw new Error('Original text should still be in preview')
    }
    if (!previewText.includes('Cortex frontal') || !previewText.includes('12.5')) {
      const screenshot = await takeScreenshot(page, 'lesion-not-in-preview')
      screenshots.push(screenshot)
      throw new Error('Lesion target should appear in preview after text')
    }

    // Test 4: Navigate to another section (tab)
    const secondTab = await page.$$('.section-tabs button')
    if (secondTab.length > 1) {
      await secondTab[1].click()
      await new Promise(resolve => setTimeout(resolve, 500))

      // Should show normal mode for new section
      const normalPhraseAgain = await page.$('.normal-phrase')
      if (!normalPhraseAgain) {
        console.log('   ⚠️  Warning: Second section should default to Normal mode')
      }
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

    reporter.recordPass('Sections anatomiques: 2 modes (Normal + Anomalie avec lésions)')

  } catch (error) {
    error.consoleErrors = getConsoleErrors(page)
    if (screenshots.length === 0) {
      screenshots.push(await takeScreenshot(page, 'final-error'))
    }
    reporter.recordFailure('Sections anatomiques: 2 modes (Normal + Anomalie avec lésions)', error, screenshots)
    throw error
  }
}
