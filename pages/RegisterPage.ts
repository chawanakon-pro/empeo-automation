import { expect, Locator, Page } from "@playwright/test";
import type { RegistrationData, RegistrationType } from "../data/testData";

/**
 * Thai UI labels. If a label differs on the real page, fix it here only.
 * Patterns allow an optional space before the required-field asterisk.
 */
const LABELS = {
  companySearch: /เลขประจำตัวผู้เสียภาษี|ชื่อบริษัท/,
  businessType: /ประเภทธุรกิจ/,
  employees: /ผู้ใช้งาน/,
  email: /^อีเมล\s*\*?$/,
  firstName: /^ชื่อ\s*\*?$/,
  lastName: /^นามสกุล\s*\*?$/,
  phone: /^เบอร์มือถือ\s*\*?$/,
  promoLink: /ใช้โค้ดส่วนลด/,
  promoInput: /^รหัสส่วนลด$/,
  submit: /ทดลองใช้ฟรี/,
};

/** Position of each radio on the form (left to right). Found by position, not by Thai text. */
const RADIO_INDEX = { thai: 0, other: 1 } as const;

/** Finds a text field by placeholder, label, or accessible name. */
const field = (page: Page, name: RegExp): Locator =>
  page
    .getByPlaceholder(name)
    .or(page.getByLabel(name))
    .or(page.getByRole("textbox", { name }))
    .first();

/** Page object for https://portal.uat.gofive.co.th/Register/empeo */
export class RegisterPage {
  readonly companySearch: Locator;
  readonly businessTypeDropdown: Locator;
  readonly employeesDropdown: Locator;
  readonly email: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly phone: Locator;
  readonly promoLink: Locator;
  readonly promoInput: Locator;
  readonly promoApplyButton: Locator;
  readonly termsCheckbox: Locator;
  readonly submitButton: Locator;
  readonly otpInputs: Locator;
  readonly otpConfirmButton: Locator;
  readonly resultDialogTitle: Locator;
  readonly resultDialogMessage: Locator;
  readonly resultDialogOk: Locator;

  constructor(private readonly page: Page) {
    // The company input is the first textbox on the form; its placeholder changes with the radio.
    this.companySearch = page
      .getByPlaceholder(LABELS.companySearch)
      .or(page.getByRole("textbox").first())
      .first();
    this.businessTypeDropdown = page
      .locator(".go5-form-field")
      .filter({ hasText: LABELS.businessType })
      .first();
    this.employeesDropdown = page
      .locator(".go5-form-field")
      .filter({ hasText: LABELS.employees })
      .first();
    this.email = field(page, LABELS.email);
    this.firstName = field(page, LABELS.firstName);
    this.lastName = field(page, LABELS.lastName);
    this.phone = field(page, LABELS.phone);
    this.promoLink = page.getByText(LABELS.promoLink);
    this.promoInput = field(page, LABELS.promoInput);
    this.promoApplyButton = page.getByTestId(
      "input_button_registration_btn_apply",
    ); // a <p>, not a button
    this.termsCheckbox = page.getByTestId(
      "input_checkbox_registration_checkbox",
    );
    this.submitButton = page.getByRole("button", { name: LABELS.submit });
    // OTP: supports one input (maxlength 6 / one-time-code) or six single-digit boxes.
    this.otpInputs = page.locator(
      'input[autocomplete="one-time-code"], input[maxlength="1"], input[maxlength="6"]',
    );
    this.otpConfirmButton = page.getByTestId(
      "button_button_registration_verify",
    );
    this.resultDialogTitle = page.getByText("Error!", { exact: true });
    this.resultDialogMessage = page.getByText("Oops...", { exact: true });
    this.resultDialogOk = page.getByRole("button", { name: "OK", exact: true });
  }

  async open() {
    await this.page.goto("/Register/empeo");
    // The Crisp chat icon floats over the form and can swallow clicks, so make it click-through.
    await this.page.addStyleTag({
      content: 'img[alt="Crisp Chat"] { pointer-events: none !important; }',
    });
    await expect(this.submitButton).toBeVisible();
    await expect(this.companySearch).toBeVisible();
  }

  private registrationRadio(type: RegistrationType): Locator {
    return this.page.locator('input[type="radio"]').nth(RADIO_INDEX[type]);
  }

  /** Must run before any other field is filled: switching the radio changes the company input. */
  async selectRegistrationType(type: RegistrationType) {
    const radio = this.registrationRadio(type);
    await radio.check({ force: true }); // custom radios often hide the native input
    await expect(radio).toBeChecked();
  }

  async fillCompany(name: string) {
    await this.companySearch.fill(name);
    await expect(this.companySearch).toHaveValue(name);
  }

  private async selectFromDropdown(dropdown: Locator, optionText: string) {
    await dropdown.click();
    await this.page.getByText(optionText, { exact: true }).first().click();
  }

  async fillForm(data: Omit<RegistrationData, "otp" | "promo">) {
    await this.selectRegistrationType(data.registrationType);
    await this.fillCompany(data.company);
    await this.selectFromDropdown(this.businessTypeDropdown, data.businessType);
    await this.selectFromDropdown(this.employeesDropdown, data.employees);
    await this.email.fill(data.email);
    await this.firstName.fill(data.firstName);
    await this.lastName.fill(data.lastName);
    await this.phone.fill(data.phone);
    // Make sure the page did not reset the form while typing.
    await expect(this.email).toHaveValue(data.email);
    await expect(this.firstName).toHaveValue(data.firstName);
    await expect(this.lastName).toHaveValue(data.lastName);
  }

  /** Opens the promo field, types the code and clicks "ใช้โค้ด". Does not assert the outcome. */
  async enterPromo(code: string) {
    await this.promoLink.click();
    await this.promoInput.fill(code);
    await this.promoApplyButton.click();
  }

  /** Applies a valid promo: the apply control disappears once the code is accepted. */
  async applyPromo(code: string) {
    await this.enterPromo(code);
    await expect(this.promoApplyButton).toBeHidden();
  }

  async acceptTerms() {
    await this.termsCheckbox.scrollIntoViewIfNeeded();

    await expect(async () => {
      if (!(await this.termsCheckbox.isChecked())) {
        await this.termsCheckbox.click({ timeout: 3_000 });
      }
      await expect(this.termsCheckbox).toBeChecked({ timeout: 1_000 });
    }).toPass({ timeout: 10_000 });
  }

  async submit() {
    await this.submitButton.click();
  }

  async enterOtp(otp: string) {
    await this.otpInputs.first().waitFor({ state: "visible", timeout: 15_000 });

    if ((await this.otpInputs.count()) >= otp.length) {
      for (let i = 0; i < otp.length; i++) {
        await this.otpInputs.nth(i).click();
        await this.page.keyboard.type(otp[i]);
      }
    } else {
      await this.otpInputs.first().click();
      await this.page.keyboard.type(otp, { delay: 100 });
    }

    await expect(this.otpConfirmButton).toBeEnabled();
    await this.otpConfirmButton.click();
  }

  async expectRegistrationResult() {
    await expect(this.resultDialogTitle).toBeVisible({ timeout: 30_000 });
    await expect(this.resultDialogMessage).toBeVisible();
    await expect(this.resultDialogOk).toBeVisible();
  }

  async expectMessages(messages: readonly string[]) {
    for (const message of messages) {
      await expect(this.page.getByText(message, { exact: true })).toBeVisible();
    }
  }

  async expectOtpNotRequested() {
    await this.page.waitForTimeout(3_000);
    await expect(this.otpConfirmButton).toBeHidden();
    await expect(this.submitButton).toBeVisible();
    await expect(this.page).toHaveURL(/\/Register\/empeo/i);
  }
}
