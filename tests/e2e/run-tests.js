#!/usr/bin/env node

/**
 * E2E Test Runner for Pet Report
 * Usage: npm test [scenario]
 * Scenarios: all, quick, workflow, sections, lesions
 */

import { runTests } from './test-runner.js'

const scenario = process.argv[2] || 'all'

console.log(`🧪 Starting E2E tests for pet_report`)
console.log(`📦 Scenario: ${scenario}\n`)

try {
  const results = await runTests(scenario)

  if (results.success) {
    console.log(`\n✅ All tests passed (${results.passed}/${results.total})`)
    process.exit(0)
  } else {
    console.log(`\n❌ Some tests failed (${results.passed}/${results.total})`)
    console.log(`\n📄 Full report: test-report.md`)
    process.exit(1)
  }
} catch (error) {
  console.error(`\n💥 Fatal error:`, error)
  process.exit(1)
}
