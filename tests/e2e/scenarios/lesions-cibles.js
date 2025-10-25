/**
 * Test CRUD operations for lésions cibles
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

export async function testLesionsCibles(page, reporter) {
  resetScreenshotCounter()
  const screenshots = []

  try {
    // Navigate to Results step quickly
    await page.goto('http://localhost:5173/pet_report/', { waitUntil: 'networkidle2' })
    // Clear localStorage to ensure fresh state
    await page.evaluate(() => localStorage.clear())
    await page.reload({ waitUntil: 'networkidle2' })
    await new Promise(resolve => setTimeout(resolve, 1500))

    await typeText(page, '[data-testid="age-input"]', '62')
    await clickElement(page, '[data-testid="btn-F"]')
    await clickElement(page, '[data-testid="btn-next-step"]')
    await new Promise(resolve => setTimeout(resolve, 800))

    await clickElement(page, '[data-testid="indication-bilan"]')
    await new Promise(resolve => setTimeout(resolve, 800))

    await clickElement(page, '[data-testid="cancer-cancer du sein"]')
    await new Promise(resolve => setTimeout(resolve, 800))
    await clickElement(page, '[data-testid="btn-droit"]')
    await clickElement(page, '[data-testid="btn-next-step"]')
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Switch to Anomalie mode (lésions cibles are now in this mode)
    await clickElement(page, '[data-testid="mode-anomalie"]')
    await new Promise(resolve => setTimeout(resolve, 500))

    // Test 1: Add a lesion
    await typeText(page, '#lesion-localisation', 'Segment VII hépatique')
    await typeText(page, '#lesion-suvmax', '8.5')
    await typeText(page, '#lesion-volume', '12.3')

    // Find and click "Ajouter" button
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      const addButton = buttons.find(b => b.textContent.includes('Ajouter'))
      if (addButton) addButton.click()
    })
    await new Promise(resolve => setTimeout(resolve, 500))

    // Verify lesion appears in list
    const lesionText = await page.$eval('.lesions-list', el => el.textContent)
    if (!lesionText.includes('Segment VII')) {
      const screenshot = await takeScreenshot(page, 'lesion-add-fail')
      screenshots.push(screenshot)
      throw new Error('Added lesion should appear in list')
    }

    // Verify it appears in preview
    const previewText = await page.$eval('.preview-content', el => el.textContent)
    if (!previewText.includes('Lésions cibles') && !previewText.includes('Segment VII')) {
      throw new Error('Lesion should appear in preview report')
    }

    // Test 2: Edit the lesion
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      const editButton = buttons.find(b => b.title === 'Modifier')
      if (editButton) editButton.click()
    })
    await new Promise(resolve => setTimeout(resolve, 500))

    // Change SUVmax
    const editInput = await page.$('input.edit-input[type="number"]')
    if (editInput) {
      await editInput.click({ clickCount: 3 }) // Select all
      await editInput.type('9.2')

      // Click save
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'))
        const saveButton = buttons.find(b => b.textContent.includes('Enregistrer'))
        if (saveButton) saveButton.click()
      })
      await new Promise(resolve => setTimeout(resolve, 500))

      // Verify edit persisted
      const updatedText = await page.$eval('.lesions-list', el => el.textContent)
      if (!updatedText.includes('9.2')) {
        throw new Error('Lesion edit should persist')
      }
    }

    // Test 3: Add second lesion
    await typeText(page, '#lesion-localisation', 'Vertèbre L3')
    await typeText(page, '#lesion-suvmax', '6.7')

    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      const addButton = buttons.find(b => b.textContent.includes('Ajouter'))
      if (addButton) addButton.click()
    })
    await new Promise(resolve => setTimeout(resolve, 500))

    // Verify 2 lesions in list
    const twoLesions = await page.$$('.lesion-item')
    if (twoLesions.length !== 2) {
      const screenshot = await takeScreenshot(page, 'two-lesions-fail')
      screenshots.push(screenshot)
      throw new Error(`Expected 2 lesions, got ${twoLesions.length}`)
    }

    // Test 4: Delete first lesion
    page.on('dialog', async dialog => {
      await dialog.accept() // Accept confirmation
    })

    const deleteButtons = await page.$$('button[title="Supprimer"]')
    if (deleteButtons.length > 0) {
      await deleteButtons[0].click()
      await new Promise(resolve => setTimeout(resolve, 500))

      // Should have only 1 lesion left
      const remainingLesions = await page.$$('.lesion-item')
      if (remainingLesions.length !== 1) {
        throw new Error(`Expected 1 lesion after delete, got ${remainingLesions.length}`)
      }

      // Verify it's the second one (Vertèbre L3)
      const remainingText = await page.$eval('.lesions-list', el => el.textContent)
      if (!remainingText.includes('Vertèbre L3')) {
        throw new Error('Wrong lesion was deleted')
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

    reporter.recordPass('Lésions cibles: CRUD operations')

  } catch (error) {
    error.consoleErrors = getConsoleErrors(page)
    if (screenshots.length === 0) {
      screenshots.push(await takeScreenshot(page, 'final-error'))
    }
    reporter.recordFailure('Lésions cibles: CRUD operations', error, screenshots)
    throw error
  }
}
