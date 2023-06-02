import { NextFunction, Request, Response } from "express";
import { SignupDto } from "./dtos/signup.dto";
import { createUser } from "../user/user.service";
import { ACCOUNT_TYPES, HTTP_STATUS, IResponse } from "../util/data";
import { createLogManager } from "simple-node-logger";
import { SigninDto } from "./dtos/signin.dto";
import { User } from "../user/user.schema";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

const logger = createLogManager().createLogger("AuthService");

export interface IAccessToken {
  _id: string;
  emailAddress: string;
  accountType: ACCOUNT_TYPES;
  [key: string]: string; // since jwt can add some metadata like 'iat' (isseud at)
}

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

export async function signin(req: Request, res: Response, next: NextFunction) {
  try {
    const { emailAddress, password } = req.body;
    const signinDto = new SigninDto(emailAddress, password);

    const user = await User.findOne({ emailAddress }).populate("password");

    if (!user || !(await bcrypt.compare(signinDto.password!, user.password))) {
      const message: IResponse = {
        message: "Incorrect email address or password provided.",
        status: HTTP_STATUS.unauthorized,
      };
      return res.status(HTTP_STATUS.unauthorized).json(message);
    }

    const { password: _, ...signedInUser } = Object.assign(
      { accessToken: "", status: 200 },
      user.toObject()
    );
    const token: IAccessToken = {
      _id: signedInUser._id.toString(),
      emailAddress: signedInUser.emailAddress,
      accountType: signedInUser.accountType!!,
    };
    signedInUser.accessToken = genJwtToken(token)!;
    res.status(HTTP_STATUS.ok).json({
      status: HTTP_STATUS.ok,
      message: "Signed in",
      user: signedInUser,
    });
  } catch (err: any) {
    logger.error(err.message || err);
    next(err);
  }
}

export function genJwtToken(token: string | object) {
  try {
    const accessToken = jwt.sign(token, process.env.JWT_SECRET!);
    return accessToken;
  } catch (err: any) {
    logger.error(err);
    throw err;
  }
}
