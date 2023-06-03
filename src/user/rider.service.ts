import { NextFunction, Request, Response } from "express";
import { createLogManager } from "simple-node-logger";
import { RequestRideDto } from "./dtos/request-ride.dto";
import { UserType } from "./user.schema";
import { HTTP_STATUS, IResponse } from "../util/data";
import { endRide, findRide } from "../ride/ride.service";
import { EndRideDto } from "../ride/dtos/end-ride.dto";
import { RIDE_COMPLETE } from "../ride/ride.schema";

const logger = createLogManager().createLogger("RiderService");

export async function requestRide(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { pickupPoint, destination } = req.body;
    const requestRideDto = new RequestRideDto(pickupPoint, destination);
    const user = req.body._user as UserType;
    const ride = await findRide(requestRideDto, user._id);

    if (!ride) {
      const response: IResponse = {
        message:
          "You can't have multiple uncompleted ride, please cancel all open rides before reqesting another.",
        status: HTTP_STATUS.conflict,
      };
      return res.status(response.status).json(response);
    }

    const response: IResponse = {
      message: "Ride reqested. Please wait while we find you a driver...",
      status: HTTP_STATUS.created,
      ride,
    };
    res.status(response.status).json(response);
  } catch (err: any) {
    logger.error(err);
    next(err);
  }
}

// any ride ended by user is considered cancelled
export async function riderEndRide(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.body._user as UserType;
    const endRideDto = new EndRideDto(
      undefined,
      user._id.toString(),
      RIDE_COMPLETE.cancelled
    );

    const ride = await endRide(endRideDto);

    const response: IResponse = {
      message: "Ride successfully ended.",
      status: HTTP_STATUS.ok,
      ride: ride,
    };
    res.status(response.status).json(response);
  } catch (err: any) {
    logger.error(err);
    next(err);
  }
}
