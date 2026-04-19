# Decisions

## Page Object Model
Each page has its own class. Locators are defined inline as `readonly` properties — not in the constructor — which is the Playwright-idiomatic pattern.

`BasePage` exists only to share the `page` instance. Kept it minimal on purpose.

Public locators are exposed directly as properties for assertions. Private locators stay internal to the class.

## Authentication
Auth runs once in `auth.setup.ts` and the session is shared across tests via `storageState`. No login before every test.

The setup always re-authenticates on each suite run instead of checking for an existing file — avoids stale session failures that are hard to debug.

## Custom Fixtures
Page objects are provided via a custom `test` fixture in `tests/fixtures.ts`. No instantiation inside tests.

## Test Data
Test data lives in `tests/data/`. Kept separate from test logic so payloads, credentials, and field definitions have a single place to update.

## API Schema Validation
Using Zod instead of `toHaveProperty` checks. Validates shape and types in one call and gives precise error messages pointing to the exact field that broke.

## Secrets Management
Credentials are stored in `.env` locally and as GitHub repository secrets in CI. Secret names match env variable names exactly to avoid confusion.
