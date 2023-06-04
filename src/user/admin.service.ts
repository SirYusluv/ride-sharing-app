import { NextFunction, Request, Response } from "express";

import { createLogManager } from "simple-node-logger";
import { ModifyUserDto } from "./dtos/modify-user.dto";
import { UserType } from "./user.schema";
import { ACCOUNTS, HTTP_STATUS, IResponse } from "../util/data";
import { modifyUser } from "./user.service";

const logger = createLogManager().createLogger("AdminService");

export async function adminModifyUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { emailAddress, firstName, lastName, address, contact, isBlocked } =
      req.body;

    const user = req.body._user as UserType;

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
