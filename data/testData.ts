/** Test data, one export per test case (TC_ID matches the spreadsheet). The UI is Thai only. */
export type RegistrationType = "thai" | "other";

export interface RegistrationData {
  registrationType: RegistrationType;
  company: string;
  businessType: string;
  employees: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  otp: string;
  promo: string;
}

const VALID: RegistrationData = {
  registrationType: "other",
  company: "NaiComperate123",
  businessType: "เทคโนโลยี",
  employees: "21-50",
  email: "chaonai00912@gmail.com",
  firstName: "Nene",
  lastName: "Promsi",
  phone: "0967690708",
  otp: "123456",
  promo: "FREE15DAY",
};

export const TC_REGIS_00001: RegistrationData = { ...VALID };

export const TC_REGIS_00004: RegistrationData = {
  ...VALID,
  email: "chaonai00912.com",
};

export const TC_REGIS_00005: RegistrationData = { ...VALID, phone: "12345" };

export const TC_REGIS_00006: RegistrationData = { ...VALID, otp: "000000" };

export const TC_REGIS_00007: RegistrationData = {
  ...VALID,
  promo: "INVALIDCODE",
};

export const TC_REGIS_00008: RegistrationData = {
  ...VALID,
  phone: "090332212321312",
};
