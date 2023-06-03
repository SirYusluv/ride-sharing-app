import { Types } from "mongoose";
import { RequestRideDto } from "../user/dtos/request-ride.dto";
import { createLogManager } from "simple-node-logger";
import { calculateDist } from "../util/helper";
import { Ride } from "./ride.schema";

const logger = createLogManager().createLogger("RideService");

export async function findRide(
  requestRideDto: RequestRideDto,
  userId: Types.ObjectId
) {
  try {
    // user can't have two uncompleted ride
    const userHasUncompletedRide = await Ride.findOne({
      rider: userId,
      rideCompleteStatus: false,
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

export async function acceptRide() {
  try {
  } catch (err: any) {
    logger.error(err);
    throw err;
  }
}
