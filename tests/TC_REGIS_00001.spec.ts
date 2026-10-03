import { expect, test } from "@playwright/test";
import { TC_REGIS_00001 as data } from "../data/testData";
import { RegisterPage } from "../pages/RegisterPage";

test.describe("Registration", () => {
  test("TC_REGIS_00001 - Register with all valid data @smoke @regression", async ({
    page,
  }) => {
    const register = new RegisterPage(page);

    await test.step("1. Open the URL", async () => {
      await register.open();
      await expect(page).toHaveURL(
        "https://portal.uat.gofive.co.th/Register/empeo",
      );
    });

    await test.step("2. Enter Testdata in to field ", async () => {
      await register.fillForm(data);
      await register.applyPromo(data.promo);
    });

    await test.step("3. Checked term and condition checkbox", async () => {
      await register.acceptTerms();
    });

    await test.step('4. Click the "Try for free" button', async () => {
      await register.submit();
    });

    await test.step("5-6. Enter OTP and confirm", async () => {
      await register.enterOtp(data.otp);
    });

    await test.step('7. Validate: result card "Error! Oops..." is shown (mock phone)', async () => {
      await register.expectRegistrationResult();
    });
  });
});
