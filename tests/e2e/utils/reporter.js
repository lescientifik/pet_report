/**
 * Test reporter - generates markdown report with screenshots
 */

import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { writeFileSync, readdirSync, unlinkSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const REPORT_PATH = join(__dirname, '../../../..', 'test-report.md')
const SCREENSHOTS_DIR = join(__dirname, '../screenshots')

export function createReporter() {
  const tests = []
  const failures = []

  return {
    /**
     * Record test pass
     */
    recordPass(testName) {
      tests.push({ name: testName, passed: true })
    },

    /**
     * Record test failure with details
     */
    recordFailure(testName, error, screenshots = []) {
      tests.push({ name: testName, passed: false })
      failures.push({
        testName,
        error: error.message || error.toString(),
        stack: error.stack,
        screenshots,
        consoleErrors: error.consoleErrors || []
      })
    },

    /**
     * Get current results summary
     */
    getResults() {
      const total = tests.length
      const passed = tests.filter(t => t.passed).length
      const failed = total - passed

      return { total, passed, failed }
    },

    /**
     * Generate markdown report
     */
    async generate(duration) {
      const results = this.getResults()
      const timestamp = new Date().toLocaleString('fr-FR')

      let markdown = `# 🧪 Test Report - pet_report\n`
      markdown += `**Date**: ${timestamp}\n`
      markdown += `**Duration**: ${Math.floor(duration / 60)}m ${duration % 60}s\n\n`

      markdown += `## Summary\n`
      if (results.failed === 0) {
        markdown += `✅ **All tests passed (${results.passed}/${results.total})**\n\n`
      } else {
        markdown += `✅ **${results.passed}/${results.total} tests passed**\n`
        markdown += `❌ **${results.failed}/${results.total} tests failed**\n\n`
      }

      markdown += `---\n\n`

      // Failed tests section
      if (failures.length > 0) {
        markdown += `## ❌ Failed Tests\n\n`

        failures.forEach((failure, idx) => {
          markdown += `### ${idx + 1}. ${failure.testName}\n\n`
          markdown += `**Error**: ${failure.error}\n\n`

          if (failure.consoleErrors && failure.consoleErrors.length > 0) {
            markdown += `**Console errors**:\n\`\`\`\n`
            failure.consoleErrors.forEach(err => {
              markdown += `${err.text}\n`
            })
            markdown += `\`\`\`\n\n`
          }

          if (failure.screenshots && failure.screenshots.length > 0) {
            markdown += `**Screenshots**:\n`
            failure.screenshots.forEach(screenshot => {
              markdown += `![${screenshot.filename}](.claude/skills/test-pet-report/screenshots/${screenshot.filename})\n\n`
            })
          }

          markdown += `**Suggested fix**: See error details above and check the implementation in the relevant component.\n\n`
          markdown += `---\n\n`
        })
      }

      // Passed tests section
      const passedTests = tests.filter(t => t.passed)
      if (passedTests.length > 0) {
        markdown += `## ✅ Passed Tests\n\n`
        passedTests.forEach(test => {
          markdown += `- ✅ ${test.name}\n`
        })
        markdown += `\n`
      }

      // Write report
      writeFileSync(REPORT_PATH, markdown, 'utf-8')

      // Clean up old screenshots if all tests passed
      if (results.failed === 0) {
        this.cleanupScreenshots()
      }

      return REPORT_PATH
    },

    /**
     * Clean up screenshots directory (only keep failed test screenshots)
     */
    cleanupScreenshots() {
      try {
        const files = readdirSync(SCREENSHOTS_DIR)
        files.forEach(file => {
          const filepath = join(SCREENSHOTS_DIR, file)
          unlinkSync(filepath)
        })
        console.log('   🗑️  Cleaned up screenshots (all tests passed)')
      } catch (error) {
        // Ignore errors
      }
    }
  }
}
