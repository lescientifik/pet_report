/**
 * Main test orchestrator
 */

import { ensureServerRunning } from './utils/server.js'
import { launchBrowser, closeBrowser } from './utils/browser.js'
import { createReporter } from './utils/reporter.js'
import { testWorkflowBilanExtension } from './scenarios/workflow-bilan-extension.js'
import { testWorkflowReevaluation } from './scenarios/workflow-reevaluation.js'
import { testSectionsAnatomiques } from './scenarios/sections-anatomiques.js'
import { testLesionsCibles } from './scenarios/lesions-cibles.js'

const SCENARIOS = {
  quick: [testWorkflowBilanExtension],
  workflow: [testWorkflowBilanExtension, testWorkflowReevaluation],
  sections: [testSectionsAnatomiques],
  lesions: [testLesionsCibles],
  all: [
    testWorkflowBilanExtension,
    testWorkflowReevaluation,
    testSectionsAnatomiques,
    testLesionsCibles
  ]
}

export async function runTests(scenario = 'all') {
  const startTime = Date.now()
  const reporter = createReporter()
  let browser = null
  let page = null

  try {
    // Ensure Vite dev server is running
    console.log('🔍 Checking dev server...')
    await ensureServerRunning()
    console.log('✅ Dev server ready\n')

    // Launch browser
    console.log('🚀 Launching browser...')
    const browserResult = await launchBrowser()
    browser = browserResult.browser
    page = browserResult.page
    console.log('✅ Browser ready\n')

    // Get tests for scenario
    const tests = SCENARIOS[scenario] || SCENARIOS.all
    if (!tests) {
      throw new Error(`Unknown scenario: ${scenario}. Available: ${Object.keys(SCENARIOS).join(', ')}`)
    }

    // Run tests
    for (const testFn of tests) {
      console.log(`\n📝 Running: ${testFn.name}`)
      try {
        await testFn(page, reporter)
        console.log(`   ✅ Passed`)
      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`)
        reporter.recordFailure(testFn.name, error)
      }
    }

    // Generate report
    const duration = Math.floor((Date.now() - startTime) / 1000)
    const reportPath = await reporter.generate(duration)

    const results = reporter.getResults()

    return {
      success: results.failed === 0,
      passed: results.passed,
      failed: results.failed,
      total: results.total,
      reportPath
    }

  } catch (error) {
    console.error('Fatal error during test execution:', error)
    throw error
  } finally {
    if (browser) {
      await closeBrowser(browser)
    }
  }
}
