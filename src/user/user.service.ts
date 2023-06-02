import { SignupDto } from "../auth/dtos/signup.dto";
import { createLogManager } from "simple-node-logger";
import {
  BCRYPT_SALT,
  HTTP_STATUS,
  MONGOOSE_STATUS,
  SPLIT_PATTERN,
} from "../util/data";
import { User } from "./user.schema";
import * as bcrypt from "bcrypt";

const logger = createLogManager().createLogger("AuthService");

export async function createUser(signupDto: SignupDto) {
  try {
    const user = new User(signupDto);
    user.password = await bcrypt.hash(user.password, BCRYPT_SALT);
    return await user.save();
  } catch (err: any) {
    logger.error(err);
    if (err.code === MONGOOSE_STATUS.duplicateError) {
      throw new Error(
        `${
          Object.entries(err.keyValue || { value: "value" })[0][1]
        } is already in use.${SPLIT_PATTERN}${HTTP_STATUS.conflict}`
      );
    }

    throw new Error(
      `Error creating user, please try again later${SPLIT_PATTERN}${HTTP_STATUS.internalServerError}`
    );
  }
}
