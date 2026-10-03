import { expect, test } from "@playwright/test";
import { TC_REGIS_00004 as data } from "../data/testData";
import { RegisterPage } from "../pages/RegisterPage";
import { EXPECTED_TC_REGIS_00004 } from "../data/messages";

test.describe("Registration - email", () => {
  test("TC_REGIS_00004 - Register with invalid email format @regression", async ({
    page,
  }) => {
    const register = new RegisterPage(page);

    await test.step("1. Open the URL", async () => {
      await register.open();
      await expect(page).toHaveURL(
        "https://portal.uat.gofive.co.th/Register/empeo",
      );
    });

    await test.step("3. Enter valid data with an invalid email", async () => {
      await register.fillForm(data);
    });

    await test.step("4. Validate: a required message is shown for every field", async () => {
      await register.expectMessages(Object.values(EXPECTED_TC_REGIS_00004));
      await register.expectOtpNotRequested();
    });
  });
});
