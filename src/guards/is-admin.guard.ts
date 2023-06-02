import { NextFunction, Request, Response } from "express";
import { ACCOUNTS, HTTP_STATUS, IResponse } from "../util/data";
import { createLogManager } from "simple-node-logger";

const logger = createLogManager().createLogger(isUserAdminUserGuard.name);

export function isUserAdminUserGuard(
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

    if (req.body._user?.accountType != ACCOUNTS.admin) {
      const response: IResponse = {
        message:
          "Invalid authorization. You don't have authority to access the requested resource.",
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
