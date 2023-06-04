import { NextFunction, Request, Response } from "express";
import { createLogManager } from "simple-node-logger";
import { RegisterCarDto } from "../ride/dtos/register-car.dto";
import { Car } from "../ride/car.schema";
import { UserType } from "./user.schema";
import {
  AMONT_PER_KM as AMOUNT_PER_KM,
  HTTP_STATUS,
  IResponse,
  MONGOOSE_STATUS,
  SPLIT_PATTERN,
} from "../util/data";
import { UnregisterCarDto } from "../ride/dtos/unregister-car.dto";
import {
  acceptRideWithId,
  endRide,
  findRidesRequestingDriverAroundMe,
  startActiveRide,
} from "../ride/ride.service";
import { AcceptRideDto } from "../ride/dtos/accept-ride.dto";
import { EndRideDto } from "../ride/dtos/end-ride.dto";
import { RIDE_COMPLETE, Ride } from "../ride/ride.schema";
import { RideInfo } from "../ride/ride-info.schema";
import { StartRideDto } from "../ride/dtos/start-ride.dto";
import { Types } from "mongoose";

const logger = createLogManager().createLogger("DriverService");

export async function registerCar(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { make, model, color, numberPlate, capacity } = req.body;
    const registerCarDto = new RegisterCarDto(
      make,
      model,
      color,
      numberPlate,
      capacity
    );
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
    const user = req.body._user as UserType;

    // a driver with no car should not be able to accept ride
    if (!driverHasACar(user)) {
      const response: IResponse = {
        message:
          "You need to have a car registered before you can start accepting rides.",
        status: HTTP_STATUS.ok,
      };
      return res.status(response.status).json(response);
    }

    const { _id } = req.params;
    const acceptRideDto = new AcceptRideDto(_id);

    const response: IResponse = {
      message: "Ride accepted. Please proceed to client's location.",
      status: HTTP_STATUS.ok,
      ride: await acceptRideWithId(acceptRideDto, req.body._user),
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
    const { rideId } = req.params;
    const startRideDto = new StartRideDto(rideId);

    const user = req.body._user as UserType;

    const response: IResponse = {
      message: "Ride successfully started.",
      status: HTTP_STATUS.ok,
      ride: await startActiveRide(startRideDto, user),
    };
    res.status(response.status).json(response);
  } catch (err: any) {
    logger.error(err);
    next(err);
  }
}

export async function driverEndRide(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.body._user as UserType;
    const { reason } = req.query;
    const { rideId } = req.params;

    const endRideDto = new EndRideDto(
      user._id.toString(),
      undefined,
      rideId,
      reason ? reason.toString() : undefined
    );

    const ride = await endRide(endRideDto);

    // decrement currRideCount
    decrementCurrRideCount(user._id);

    const response: IResponse = {
      message: "Ride successfully ended.",
      status: HTTP_STATUS.ok,
      amount:
        ride.reasonForRideCompletion === RIDE_COMPLETE.completed
          ? ride.distanceFromPickupToDest * AMOUNT_PER_KM
          : null,
      ride: ride,
    };
    res.status(response.status).json(response);
  } catch (err: any) {
    logger.error(err);
    next(err);
  }
}

export async function findDriverUncompletedRides(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.body._user as UserType;

    const rides = await RideInfo.find({
      driver: user._id,
      rideComplete: false,
    });

    const response: IResponse = {
      message: "",
      status: HTTP_STATUS.ok,
      rides: rides,
    };
    res.status(response.status).json(response);
  } catch (err: any) {
    logger.error(err);
    next(err);
  }
}

export async function createDriverRide(driver: UserType) {
  try {
    await new Ride({ driver: driver._id }).save();
  } catch (err) {
    logger.error(err);
    throw err;
  }
}

async function driverHasACar(driver: UserType) {
  try {
    const driverDoesHaveACar = await Car.findOne({ owner: driver._id });
    return !!driverDoesHaveACar;
  } catch (err: any) {
    logger.error(err);
    throw err;
  }
}

async function decrementCurrRideCount(
  driverId: Types.ObjectId,
  decrementAmount: number = 1
) {
  try {
    const ride = await Ride.findOne({ driver: driverId });

    if (!ride) return;

    ride.currentRideCount = ride.currentRideCount - decrementAmount;
    return await ride.save();
  } catch (err: any) {
    logger.error(err);
    throw err;
  }
}
