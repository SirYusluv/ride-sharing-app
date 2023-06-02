import {
  HTTP_STATUS,
  PASSWORD_MIN_LENHT,
  SPLIT_PATTERN,
} from "../../util/data";
import { emailIsValid, passwordIsValid } from "../../util/helper";

export class SigninDto {
  emailAddress: string | null = null;
  password: string | null = null;

  constructor(emailAddress: string, password: string) {
    this.setEmailAddress(emailAddress || "");
    this.setPassword(password || "");
  }

  private setEmailAddress(emailAddress: string) {
    if (!emailIsValid(emailAddress))
      throw new Error(
        `Invalid email address provided.${SPLIT_PATTERN}${HTTP_STATUS.badRequest}`
      );
    this.emailAddress = emailAddress;
  }

  private setPassword(password: string) {
    if (!passwordIsValid(password))
      throw new Error(
        `Password length must be greather than ${PASSWORD_MIN_LENHT}.${SPLIT_PATTERN}${HTTP_STATUS.badRequest}`
      );
    this.password = password;
  }
}
