import { expect, test } from "@playwright/test";
import { TC_REGIS_00007 as data } from "../data/testData";
import { RegisterPage } from "../pages/RegisterPage";

test.describe("Registration - promo code", () => {
  test("TC_REGIS_00007 - Apply invalid promo code @regression", async ({
    page,
  }) => {
    const register = new RegisterPage(page);

    await test.step("1. Open the URL", async () => {
      await register.open();
      await expect(page).toHaveURL(
        "https://portal.uat.gofive.co.th/Register/empeo",
      );
    });

    await test.step('2-3. Open the promo field, enter an invalid code and click "ใช้โค้ด"', async () => {
      await register.enterPromo(data.promo);
    });

    await test.step("4. Validate: the code is not applied", async () => {
      await expect(page.getByText(data.promo, { exact: true })).toBeHidden();
    });
  });
});
