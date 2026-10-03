# empeo registration automation (Playwright + TypeScript)

## Setup (macOS)

```bash
cd empeo-automation
npm install
npx playwright install chromium
```

## Run

```bash
npm test                         # everything: safe tests first, then @consumes-data tests
npm run test:validation          # only tests that do not use up the fixed phone/promo
npm run test:consumes            # only @consumes-data tests (TC_REGIS_00001, TC_REGIS_00006)
npm run test:headed              # watch the browser
SLOWMO=500 npm run test:headed   # slow down for a demo recording
npx playwright test tests/TC_REGIS_00002.spec.ts --headed   # a single test case
npm run report                   # open the HTML report
```

Videos, screenshots, and traces are saved in `test-results/`. The HTML report is in `playwright-report/`.

## Record a video demo

- Playwright already records one `.webm` video per test in `test-results/<test>/video.webm` (`video: 'on'`).
- For one continuous demo, run `SLOWMO=500 npm run test:headed` and record the screen with macOS `Cmd + Shift + 5` (Record Entire Screen).

## Structure

- `data/testData.ts` - test data, one export per test case (`TC_REGIS_0000X`), built from one valid base record
- `data/messages.ts` - Thai validation messages
- `pages/RegisterPage.ts` - all locators and page actions
- `tests/TC_REGIS_0000X.spec.ts` - one file per test case in the spreadsheet

| Test case      | What it checks                                      |
| -------------- | --------------------------------------------------- |
| TC_REGIS_00001 | Register with all valid data and promo code Success |
| TC_REGIS_00002 | Submit empty form: all 8 required messages          |
| TC_REGIS_00004 | Invalid email: rejected, no OTP                     |
| TC_REGIS_00005 | Invalid phone: rejected, no OTP                     |
| TC_REGIS_00006 | Wrong OTP                                           |
| TC_REGIS_00007 | Invalid promo: code not applied                     |
| TC_REGIS_00008 | Phone Number 15 digits accepted                     |

## Language

The tests target the Thai UI only (browser locale `th-TH`).
