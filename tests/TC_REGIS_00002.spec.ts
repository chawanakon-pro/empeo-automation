import { expect, test } from "@playwright/test";
import { EXPECTED_TC_REGIS_00002 } from "../data/messages";
import { RegisterPage } from "../pages/RegisterPage";

test.describe("Registration - required fields", () => {
  test("TC_REGIS_00002 - Submit with all required fields empty @smoke @regression", async ({
    page,
  }) => {
    const register = new RegisterPage(page);

    await test.step("1. Open the URL", async () => {
      await register.open();
      await expect(page).toHaveURL(
        "https://portal.uat.gofive.co.th/Register/empeo",
      );
    });

    await test.step('2-3. Leave every field empty and Click "Try for free" button', async () => {
      await register.submit();
    });

    await test.step("4. Validate: a required message is shown for every field", async () => {
      await register.expectMessages(Object.values(EXPECTED_TC_REGIS_00002));
      await register.expectOtpNotRequested();
    });
  });
});
