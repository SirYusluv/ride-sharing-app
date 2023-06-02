import { HTTP_STATUS, SPLIT_PATTERN } from "../../util/data";
import {
  accountTypeIsValid,
  addressIsValid,
  contactIsValid,
  emailIsValid,
  nameIsValid,
  passwordIsValid,
} from "../../util/helper";

export class SignupDto {
  emailAddress: string | null = null;
  firstName: string | null = null;
  lastName: string | null = null;
  password: string | null = null;
  address: string | null = null;
  contact: string | null = null;
  accountType: string | null = null;

  constructor(
    emailAddress?: string,
    firstName?: string,
    lastName?: string,
    password?: string,
    address?: string,
    contact?: string,
    accountType?: string
  ) {
    this.setFirstName(firstName || "");
    this.setLastName(lastName || "");
    this.setEmailAddress(emailAddress || "");
    this.setPassword(password || "");
    this.setAddress(address || "");
    this.setContact(contact || "");
    this.setAccountType(accountType || "");
  }

  private setEmailAddress(emailAddress: string) {
    if (!emailIsValid(emailAddress))
      throw new Error(
        `Invalid email address provided.${SPLIT_PATTERN}${HTTP_STATUS.badRequest}`
      );
    this.emailAddress = emailAddress;
  }

  private setFirstName(firstName: string) {
    if (!nameIsValid(firstName))
      throw new Error(
        `Invalid first name provided.${SPLIT_PATTERN}${HTTP_STATUS.badRequest}`
      );
    this.firstName = firstName;
  }

  private setLastName(lastName: string) {
    if (!nameIsValid(lastName))
      throw new Error(
        `Invalid last name provided.${SPLIT_PATTERN}${HTTP_STATUS.badRequest}`
      );
    this.lastName = lastName;
  }

  private setPassword(password: string) {
    if (!passwordIsValid(password))
      throw new Error(
        `Invalid password provided.${SPLIT_PATTERN}${HTTP_STATUS.badRequest}`
      );
    this.password = password;
  }

  private setAddress(address: string) {
    if (!addressIsValid(address))
      throw new Error(
        `Invalid address provided.${SPLIT_PATTERN}${HTTP_STATUS.badRequest}`
      );
    this.address = address;
  }

  private setContact(contact: string) {
    if (!contactIsValid(contact))
      throw new Error(
        `Invalid contact provided.${SPLIT_PATTERN}${HTTP_STATUS.badRequest}`
      );
    this.contact = contact;
  }

  private setAccountType(accountType: string) {
    if (!accountTypeIsValid(accountType))
      throw new Error(
        `Invalid account type provided.${SPLIT_PATTERN}${HTTP_STATUS.badRequest}`
      );
    this.accountType = accountType;
  }
}
