import { SignupDto } from "../auth/dtos/signup.dto";
import { createLogManager } from "simple-node-logger";
import {
  ACCOUNTS,
  BCRYPT_SALT,
  HTTP_STATUS,
  IResponse,
  MONGOOSE_STATUS,
  SPLIT_PATTERN,
} from "../util/data";
import { User, UserType } from "./user.schema";
import * as bcrypt from "bcrypt";
import { ModifyUserDto } from "./dtos/modify-user.dto";
import { NextFunction, Request, Response } from "express";
import { createDriverRide } from "./driver.service";

const logger = createLogManager().createLogger("UserService");

export async function userModifyUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { emailAddress, firstName, lastName, address, contact, isBlocked } =
      req.body;

    const user = req.body._user as UserType;

    // only admin has the permission to set isBlock
    if (isBlocked && user.accountType !== ACCOUNTS.admin) {
      const response: IResponse = {
        message: "You are not authorized to block or unblock any user.",
        status: HTTP_STATUS.unauthorized,
      };
      return res.status(response.status).json(response);
    }

    const modifyUserDto = new ModifyUserDto(
      emailAddress,
      firstName,
      lastName,
      address,
      contact,
      isBlocked
    );

    const modifiedUser = await modifyUser(modifyUserDto);
    const { password: _, ...modifiedUserWithoutPass } = modifiedUser.toObject();

    const response: IResponse = {
      message: "User modified successfully",
      status: HTTP_STATUS.created,
      user: modifiedUserWithoutPass,
    };

    res.status(response.status).json(response);
  } catch (err: any) {
    logger.error(err);
    next(err);
  }
}

export async function createUser(signupDto: SignupDto) {
  try {
    const user = new User(signupDto);
    user.password = await bcrypt.hash(user.password, BCRYPT_SALT);
    const createdUser = await user.save();

    if (user.accountType === ACCOUNTS.driver) await createDriverRide(user);

    return createdUser;
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

export async function modifyUser(modifyUserDto: ModifyUserDto) {
  try {
    const userToModify = await User.findOne({
      emailAddress: modifyUserDto.emailAddress,
    });

    if (!userToModify)
      throw new Error(
        `Invalid user provided.${SPLIT_PATTERN}${HTTP_STATUS.badRequest}`
      );

    userToModify.firstName = modifyUserDto.firstName || userToModify.firstName;
    userToModify.lastName = modifyUserDto.lastName || userToModify.lastName;
    userToModify.address = modifyUserDto.address || userToModify.address;
    userToModify.contact = modifyUserDto.contact || userToModify.contact;
    userToModify.isBlocked = modifyUserDto.isBlocked ?? userToModify.isBlocked;

    await userToModify.save();

    return userToModify;
  } catch (err: any) {
    throw err;
  }
}
