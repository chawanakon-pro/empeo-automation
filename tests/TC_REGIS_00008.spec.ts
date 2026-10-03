import { expect, test } from "@playwright/test";
import { TC_REGIS_00008 as data } from "../data/testData";
import { FORMAT_MESSAGES } from "../data/messages";
import { RegisterPage } from "../pages/RegisterPage";

const MAX_PHONE_DIGITS = 10;

test.describe("Registration - phone", () => {
  test("TC_REGIS_00008 - Register with phone number that is too long @regression", async ({
    page,
  }) => {
    const register = new RegisterPage(page);

    await test.step("1. Open the URL", async () => {
      await register.open();
      await expect(page).toHaveURL(
        "https://portal.uat.gofive.co.th/Register/empeo",
      );
    });

    await test.step("3-4. Enter valid data with a 15-digit phone and accept the terms", async () => {
      await register.fillForm(data);
    });

    await test.step("3. Checked term and condition checkbox", async () => {
      await register.acceptTerms();
    });

    await test.step("4. Validate: a required message is shown for every field", async () => {
      await register.expectMessages(Object.values(FORMAT_MESSAGES));
      await register.expectOtpNotRequested();
    });
  });
});
