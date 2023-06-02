import { HTTP_STATUS, SPLIT_PATTERN } from "../../util/data";
import {
  addressIsValid,
  contactIsValid,
  emailIsValid,
  nameIsValid,
} from "../../util/helper";

export class ModifyUserDto {
  emailAddress: string | null = null;
  firstName: string | null = null;
  lastName: string | null = null;
  address: string | null = null;
  contact: string | null = null;
  isBlocked: boolean | null = null;

  constructor(
    emailAddress?: string,
    firstName?: string,
    lastName?: string,
    address?: string,
    contact?: string,
    isBlocked?: boolean
  ) {
    this.setEmailAddress(emailAddress || "");
    this.setFirstName(firstName || "");
    this.setLastName(lastName || "");
    this.setAddress(address || "");
    this.setContact(contact || "");
    this.setIsBlocked(isBlocked ?? null);
  }

  // email address of user to modify, cannot be null
  private setEmailAddress(emailAddress: string) {
    if (!emailIsValid(emailAddress))
      throw new Error(
        `Invalid email address provided.${SPLIT_PATTERN}${HTTP_STATUS.badRequest}`
      );
    this.emailAddress = emailAddress;
  }

  private setFirstName(firstName: string) {
    if (firstName && !nameIsValid(firstName))
      throw new Error(
        `Invalid first name provided.${SPLIT_PATTERN}${HTTP_STATUS.badRequest}`
      );
    this.firstName = firstName;
  }

  private setLastName(lastName: string) {
    if (lastName && !nameIsValid(lastName))
      throw new Error(
        `Invalid last name provided.${SPLIT_PATTERN}${HTTP_STATUS.badRequest}`
      );
    this.lastName = lastName;
  }

  private setAddress(address: string) {
    if (address && !addressIsValid(address))
      throw new Error(
        `Invalid address provided.${SPLIT_PATTERN}${HTTP_STATUS.badRequest}`
      );
    this.address = address;
  }

  private setContact(contact: string) {
    if (contact && !contactIsValid(contact))
      throw new Error(
        `Invalid contact provided.${SPLIT_PATTERN}${HTTP_STATUS.badRequest}`
      );
    this.contact = contact;
  }

  private setIsBlocked(isBlocked: boolean | null) {
    if (isBlocked !== null && typeof isBlocked !== "boolean")
      throw new Error(
        `Wrong value set for 'Block'.${SPLIT_PATTERN}${HTTP_STATUS.badRequest}`
      );
    this.isBlocked = isBlocked;
  }
}
