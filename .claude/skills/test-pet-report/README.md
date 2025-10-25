# 🧪 Test Pet Report Skill

Automated interactive testing skill for pet_report application using Puppeteer.

## Features

- 🚀 **Automated browser testing** with Puppeteer
- 📸 **Screenshots on failures** for debugging
- 🔍 **Console error detection** (Vue warnings, JS errors)
- 🤖 **Auto-fix bugs** after detection
- 📊 **Markdown reports** with detailed results

## Usage

```bash
# Run all tests (default)
/test
/test all

# Quick smoke test (10s)
/test quick

# Specific scenarios
/test workflow    # Test workflow navigation
/test sections    # Test anatomical sections
/test lesions     # Test CRUD operations
```

## Test Scenarios

### 1. Workflow: Bilan d'extension
- Tests conditional navigation (skips treatment & TEP steps)
- Verifies patient info → indication → cancer → results flow
- Checks preview generation

### 2. Workflow: Réévaluation
- Tests full workflow with all steps
- Verifies treatment and TEP comparison steps appear
- Checks date reminder in TEP step

### 3. Sections anatomiques
- Tests 3 modes: Normal / Anomalie / Lésion cible
- Verifies mode switching
- Checks preview updates

### 4. Lésions cibles CRUD
- Add lesion (localisation, SUVmax, volume)
- Edit lesion
- Delete lesion
- Verify preview generation

## Architecture

```
.claude/skills/test-pet-report/
├── skill.json              # Skill metadata
├── package.json            # Puppeteer dependency
├── index.js                # Entry point
├── test-runner.js          # Test orchestrator
├── scenarios/              # Test scenarios
│   ├── workflow-bilan-extension.js
│   ├── workflow-reevaluation.js
│   ├── sections-anatomiques.js
│   └── lesions-cibles.js
├── utils/                  # Utilities
│   ├── browser.js          # Puppeteer helpers
│   ├── server.js           # Dev server management
│   └── reporter.js         # Report generation
└── screenshots/            # Failed test screenshots
```

## Output

After running tests, a `test-report.md` file is generated at project root with:
- Summary (passed/failed)
- Failed test details with screenshots
- Console errors
- Suggested fixes

## Auto-fix

When tests fail, Claude Code automatically:
1. Reads the test report
2. Analyzes screenshots and errors
3. Proposes code fixes
4. Applies fixes if approved
5. Re-runs tests to validate

## Requirements

- Node.js >= 18
- Vite dev server (auto-started if not running)
- Puppeteer (auto-installed on first run)

## Installation

Puppeteer is installed automatically when the skill runs for the first time:

```bash
cd .claude/skills/test-pet-report
npm install
```

## Development

To add new test scenarios:

1. Create new file in `scenarios/`
2. Export async function with signature: `async function testName(page, reporter)`
3. Add to SCENARIOS map in `test-runner.js`

Example:

```javascript
export async function testNewFeature(page, reporter) {
  try {
    // Test logic
    await clickElement(page, 'button')
    // Assertions
    reporter.recordPass('Test name')
  } catch (error) {
    reporter.recordFailure('Test name', error)
    throw error
  }
}
```
