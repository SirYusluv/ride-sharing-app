import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { IAccessToken } from "../auth/auth.service";
import { HTTP_STATUS, IResponse, JWT_ERROR } from "../util/data";
import { extractTokenFromBearer } from "../util/helper";
import { User } from "../user/user.schema";

export async function isAuthenticatedGuard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const decodedToken = jwt.verify(
      extractTokenFromBearer(req.headers?.authorization || ""),
      process.env.JWT_SECRET!
    ) as IAccessToken;

    const user = await User.findOne({
      emailAddress: decodedToken.emailAddress,
    });

    if (!user) {
      const response: IResponse = {
        message: "Invalid authentication. Please log out and login.",
        status: HTTP_STATUS.unauthorized,
      };
      return res.status(response.status).json(response);
    }

    req.body._user = user;
    next();
  } catch (err: any) {
    if (
      err.message === JWT_ERROR.invalidSignature ||
      err.message === JWT_ERROR.jwtMalformed
    ) {
      const response: IResponse = {
        message: "You are not authorized access the requested resource.",
        status: HTTP_STATUS.unauthorized,
      };
      return res.status(response.status).json(response);
    }
    next(err);
  }
}
