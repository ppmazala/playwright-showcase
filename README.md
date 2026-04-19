# playwright-showcase
End-to-end test automation for SauceDemo and JSONPlaceholder API using Playwright with TypeScript.

## Installation
```bash
npm install
npx playwright install --with-deps
```

## Environment Setup

Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

## Running Tests
```bash
# Run all tests
npm test

# Run UI tests only
npm run test:ui

# Run API tests only
npm run test:api

# Run specific test file
npx playwright test tests/ui/checkout.spec.ts

# Debug mode
npm run test:debug
```

## Test Reports
```bash
npm run test:report
```
**Latest Test Report:** [View Report](https://ppmazala.github.io/playwright-showcase/)

## Linting
```bash
# Check for lint errors
npm run lint

# Auto-fix where possible
npm run lint -- --fix

# Format code
npm run format
```

## CI/CD

Tests run automatically on:
- Push to `main` branch
- Pull requests to `main` branch

Pipeline includes:
- Dependency installation
- Browser setup
- Test execution
- Report published to GitHub Pages
