import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS, IResponse } from "../util/data";
import { createLogManager } from "simple-node-logger";
import { UserType } from "../user/user.schema";

const logger = createLogManager().createLogger(isUserNotBlockedGuard.name);

export function isUserNotBlockedGuard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.body._user) {
      const response: IResponse = {
        message: "Invalid authentication. Please log out and login again.",
        status: HTTP_STATUS.unauthorized,
      };
      return res.status(response.status).json(response);
    }

    if ((req.body._user as UserType).isBlocked) {
      const response: IResponse = {
        message:
          "You can't perform the requested operation as your account has been blocked. Please contact support.",
        status: HTTP_STATUS.forbidden,
      };
      return res.status(response.status).json(response);
    }

    next();
  } catch (err: any) {
    logger.error(err);
    throw err;
  }
}
