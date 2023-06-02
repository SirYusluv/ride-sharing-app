import {
  EMAIL_ADDR_PATTERN,
  ACCOUNTS,
  HTTP_STATUS,
  SPLIT_PATTERN,
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
  PASSWORD_MIN_LENHT,
  CONTACT_MIN_LENGTH,
} from "./data";

export function extractTokenFromBearer(bearerToken: string) {
  if (!bearerToken.startsWith("Bearer ")) {
    throw new Error(
      `Invalid token provided.${SPLIT_PATTERN}${HTTP_STATUS.unauthorized}`
    );
  }
  return bearerToken.split(" ")[1];
}

export const getSupportedAccounts = () =>
  Object.entries(ACCOUNTS).map((account, _, _1) => account[1]);

export const emailIsValid = (emailAddress: string) =>
  EMAIL_ADDR_PATTERN.test(emailAddress);

export const nameIsValid = (name: string) =>
  name.length >= NAME_MIN_LENGTH || name.length <= NAME_MAX_LENGTH;

export const passwordIsValid = (password: string) =>
  password.length > PASSWORD_MIN_LENHT;

export const addressIsValid = (address: string) => !!address;

export const contactIsValid = (contact: string) =>
  contact.startsWith("+") && contact.length > CONTACT_MIN_LENGTH;

export const accountTypeIsValid = (accountType: string) =>
  (getSupportedAccounts() as string[]).includes(accountType);

export const makeIsValid = (make: string) =>
  make.length >= NAME_MIN_LENGTH || make.length <= NAME_MAX_LENGTH;

export const modelIsValid = (model: string) =>
  model.length >= NAME_MIN_LENGTH || model.length <= NAME_MAX_LENGTH;

export const colorIsValid = (color: string) =>
  color.length >= NAME_MIN_LENGTH || color.length <= NAME_MAX_LENGTH;

export const numberPlateIsValid = (numberPlate: string) =>
  numberPlate.length >= NAME_MIN_LENGTH ||
  numberPlate.length <= NAME_MAX_LENGTH;
