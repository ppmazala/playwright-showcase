# Exploratory Testing Session

Run a live exploratory session against SauceDemo using Playwright MCP. Test special users to find real defects.

## Steps

1. **Login as `problem_user`** (password: `secret_sauce`) at https://www.saucedemo.com
2. Walk the full happy path: inventory → sort products → add to cart → checkout → confirm order
3. Observe and note every defect: broken images, wrong behavior, silent failures, broken inputs
4. Repeat for `error_user`
5. Repeat for `performance_glitch_user` (note timing issues)

## Output

After exploring, produce two artifacts:

**`BUGS.md`** — structured bug report with this format per bug:
```
### BUG-N: Short title
- **User:** which test user triggers it
- **Steps:** numbered reproduction steps
- **Expected:** what should happen
- **Actual:** what actually happens
- **Severity:** Critical / High / Medium / Low
```

**`tests/ui/exploratory.spec.ts`** — one `test.fail()` spec per confirmed defect:
```ts
test.fail('BUG-N: short description', async ({ page }) => {
  // reproduction steps
  // assertion that proves the bug
});
```

## Purpose

Demonstrates QA tester mindset: finding defects, not just automating happy paths. The `test.fail()` specs lock bugs into CI — if they're ever fixed, the test flips to a passing signal.
