import { Types } from "mongoose";
import { RequestRideDto } from "../user/dtos/request-ride.dto";
import { createLogManager } from "simple-node-logger";
import { calculateDist } from "../util/helper";
import { Ride } from "./ride.schema";
import { UserType } from "../user/user.schema";
import { HTTP_STATUS, IResponse, SPLIT_PATTERN } from "../util/data";

const logger = createLogManager().createLogger("RideService");

export async function findRide(
  requestRideDto: RequestRideDto,
  userId: Types.ObjectId
) {
  try {
    // user can't have two uncompleted ride
    const userHasUncompletedRide = await Ride.findOne({
      rider: userId,
      rideComplete: false,
    });
    if (userHasUncompletedRide) return null;

    const ride = new Ride(requestRideDto);
    ride.rider = userId;
    ride.distanceFromPickupToDest = calculateDist(
      requestRideDto.pickupPoint!!,
      requestRideDto.destination!!
    );
    return await ride.save();
  } catch (err: any) {
    logger.error(err);
    throw err;
  }
}
//TODO: create not blocked guard
// since its a dummy API, it returns all route with no driver yet
export async function findRidesRequestingDriverAroundMe() {
  try {
    return await Ride.find({ driver: null });
  } catch (err: any) {
    logger.error(err);
    throw err;
  }
}

export async function acceptRideWithId(_id: Types.ObjectId, driver: UserType) {
  try {
    const ride = await Ride.findOne({ _id, driver: null });
    if (!ride)
      throw new Error(
        `Ride with id: ${_id} not found.${SPLIT_PATTERN}${HTTP_STATUS.ok}`
      );

    ride.driver = driver._id;
    ride.driverETAToPickup = calculateDist("", "", 1, 15); // generate random number from 1 to 15
    return await ride.save();
  } catch (err: any) {
    logger.error(err);
    throw err;
  }
}

export async function startActiveRide(driver: UserType) {
  try {
    const ride = await Ride.findOne({
      driver: driver._id,
      rideComplete: false,
    });
    if (!ride)
      throw new Error(`No active ride found.${SPLIT_PATTERN}${HTTP_STATUS.ok}`);

    ride.rideETAToDest = calculateDist("", "", 1, 50); // generate random number from 1 to 50
    return await ride.save();
  } catch (err: any) {
    logger.error(err);
    throw err;
  }
}
