import { NextFunction, Request, Response } from "express";
import { createLogManager } from "simple-node-logger";
import { RegisterCarDto } from "../ride/dtos/register-car.dto";
import { Car } from "../ride/car.schema";
import { UserType } from "./user.schema";
import {
  HTTP_STATUS,
  IResponse,
  MONGOOSE_STATUS,
  SPLIT_PATTERN,
} from "../util/data";
import { UnregisterCarDto } from "../ride/dtos/unregister-car.dto";
import {
  acceptRideWithId,
  findRidesRequestingDriverAroundMe,
  startActiveRide,
} from "../ride/ride.service";
import { AcceptRideDto } from "../ride/dtos/accept-ride.dto";

const logger = createLogManager().createLogger("DriverService");

export async function registerCar(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { make, model, color, numberPlate } = req.body;
    const registerCarDto = new RegisterCarDto(make, model, color, numberPlate);
    const user = req.body._user as UserType;

    const car = new Car(registerCarDto);
    car.owner = user._id;
    await car.save();

    const response: IResponse = {
      message: "Car successfully registered",
      status: HTTP_STATUS.created,
      car,
    };
    res.status(response.status).json(response);
  } catch (err: any) {
    logger.error(err);
    if (err.code === MONGOOSE_STATUS.duplicateError)
      return next(
        new Error(
          `${
            Object.entries(err.keyValue || { value: "value" })[0][1]
          } is already in use.${SPLIT_PATTERN}${HTTP_STATUS.conflict}`
        )
      );

    next(err);
  }
}

export async function unregisterCar(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { numberPlate } = req.params;
    const unregisterCarDto = new UnregisterCarDto(numberPlate);
    const user = req.body._user as UserType;

    await Car.findOneAndDelete({
      owner: user._id,
      numberPlate: unregisterCarDto.numberPlate,
    });

    const response: IResponse = {
      message: "Car unregistered and deleted successfully.",
      status: HTTP_STATUS.ok,
    };
    res.status(response.status).json(response);
  } catch (err: any) {
    logger.error(err);
    next(err);
  }
}

export async function findRides(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const response: IResponse = {
      message: "",
      status: HTTP_STATUS.ok,
      rides: await findRidesRequestingDriverAroundMe(),
    };
    res.status(response.status).json(response);
  } catch (err: any) {
    logger.error(err);
    next(err);
  }
}

export async function acceptRide(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { _id } = req.params;
    const acceptRideDto = new AcceptRideDto(_id);

    const response: IResponse = {
      message: "Ride accepted. Please proceed to client's location.",
      status: HTTP_STATUS.ok,
      ride: await acceptRideWithId(acceptRideDto._id!!, req.body._user),
    };
    res.status(response.status).json(response);
  } catch (err: any) {
    logger.error(err);
    next(err);
  }
}

export async function startRide(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.body._user as UserType;

    const response: IResponse = {
      message: "Ride successfully started.",
      status: HTTP_STATUS.ok,
      ride: await startActiveRide(user),
    };
    res.status(response.status).json(response);
  } catch (err: any) {
    logger.error(err);
    next(err);
  }
}
