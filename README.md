# empeo registration automation (Playwright + TypeScript)

## Setup (macOS)

```bash
cd empeo-automation
npm install
npx playwright install chromium
```

## Run

```bash
SLOWMO=1500 npx playwright test --headed # TO run all testcases
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
