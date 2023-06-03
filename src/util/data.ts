import path from "path";

export const SPLIT_PATTERN = ":::";
export const BCRYPT_SALT = 12;
export const EMAIL_ADDR_PATTERN =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
export const PASSWORD_MIN_LENHT = 7;
export const NAME_MIN_LENGTH = 1;
export const NAME_MAX_LENGTH = 15;
export const ADDRESS_MIN_LENGTH = 2;
export const CONTACT_MIN_LENGTH = 7; // diffrent countries can differe in contact length

export const HTTP_STATUS = {
  ok: 200,
  created: 201,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  internalServerError: 500,
  conflict: 409,
};

export const MONGOOSE_STATUS = {
  duplicateError: 11000,
};

export const JWT_ERROR = {
  invalidSignature: "invalid signature",
  jwtMalformed: "jwt malformed",
};

export interface IResponse {
  message: string;
  status: number;
  [key: string]: any;
}

export type ACCOUNT_TYPES = "ADMIN" | "DRIVER" | "RIDER";
export const ACCOUNTS: {
  admin: ACCOUNT_TYPES;
  driver: ACCOUNT_TYPES;
  rider: ACCOUNT_TYPES;
} = {
  admin: "ADMIN",
  driver: "DRIVER",
  rider: "RIDER",
};

export const AMONT_PER_KM = 750; // probably Naira
