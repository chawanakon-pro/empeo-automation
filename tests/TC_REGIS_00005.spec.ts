import { expect, test } from "@playwright/test";
import { TC_REGIS_00005 as data } from "../data/testData";
import { RegisterPage } from "../pages/RegisterPage";
import { FORMAT_MESSAGES } from "../data/messages";

test.describe("Registration - phone", () => {
  test("TC_REGIS_00005 - Register with invalid phone number @smoke", async ({
    page,
  }) => {
    const register = new RegisterPage(page);

    await test.step("1. Open the URL", async () => {
      await register.open();
      await expect(page).toHaveURL(
        "https://portal.uat.gofive.co.th/Register/empeo",
      );
    });

    await test.step("2. Enter valid data with a too-short phone", async () => {
      await register.fillForm(data);
    });

    await test.step("3. Checked term and condition checkbox", async () => {
      await register.acceptTerms();
    });

    await test.step('4. Click "ทดลองใช้ฟรี"', async () => {
      await register.submit();
    });

    await test.step("5. validate field error message", async () => {
      await register.expectMessages(Object.values(FORMAT_MESSAGES));
      await register.expectOtpNotRequested();
    });
  });
});
