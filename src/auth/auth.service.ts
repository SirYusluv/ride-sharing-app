import { NextFunction, Request, Response } from "express";
import { SignupDto } from "./dtos/signup.dto";
import { createUser } from "../user/user.service";
import { HTTP_STATUS } from "../util/data";
import { createLogManager } from "simple-node-logger";

const logger = createLogManager().createLogger("AuthService");

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      firstName,
      lastName,
      emailAddress,
      password,
      address,
      contact,
      accountType,
    } = req.body;

    const signupDto = new SignupDto(
      emailAddress,
      firstName,
      lastName,
      password,
      address,
      contact,
      accountType
    );

    const { password: _, ...createdUser } = await (
      await createUser(signupDto)
    ).toObject();

    res.status(HTTP_STATUS.created).json({
      status: HTTP_STATUS.created,
      message: "Account created. Go ahead and signin",
      createdUser,
    });
  } catch (err: any) {
    logger.error(err.message || err);
    next(err);
  }
}
