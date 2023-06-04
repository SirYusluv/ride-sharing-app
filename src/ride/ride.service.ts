import { Types } from "mongoose";
import { RequestRideDto } from "../user/dtos/request-ride.dto";
import { createLogManager } from "simple-node-logger";
import { calculateDist } from "../util/helper";
import { Ride, RideType } from "./ride.schema";
import { UserType } from "../user/user.schema";
import { ACCOUNTS, HTTP_STATUS, IResponse, SPLIT_PATTERN } from "../util/data";
import { EndRideDto } from "./dtos/end-ride.dto";
import { RIDE_COMPLETE, RideInfo, RideInfoType } from "./ride-info.schema";
import { AcceptRideDto } from "./dtos/accept-ride.dto";
import { Car } from "./car.schema";
import { StartRideDto } from "./dtos/start-ride.dto";

const logger = createLogManager().createLogger("RideService");

export async function findRide(
  requestRideDto: RequestRideDto,
  userId: Types.ObjectId
) {
  try {
    // user can't have two uncompleted ride
    const userHasUncompletedRide = await RideInfo.findOne({
      rider: userId,
      rideComplete: false,
    });
    if (userHasUncompletedRide) return null;

    const rideInfo = new RideInfo(requestRideDto);
    rideInfo.rider = userId;
    rideInfo.distanceFromPickupToDest = calculateDist(
      requestRideDto.pickupPoint!!,
      requestRideDto.destination!!
    );
    return await rideInfo.save();
  } catch (err: any) {
    logger.error(err);
    throw err;
  }
}

// since its a dummy API, it returns all route with no driver yet
export async function findRidesRequestingDriverAroundMe() {
  try {
    return await RideInfo.find({ driver: null, rideComplete: false });
  } catch (err: any) {
    logger.error(err);
    throw err;
  }
}

export async function acceptRideWithId(
  acceptRideDto: AcceptRideDto,
  driver: UserType
) {
  try {
    const _id = acceptRideDto._id; // ride to accept

    const rideInfo = await RideInfo.findOne({ _id, driver: null });
    if (!rideInfo)
      throw new Error(
        `Ride with id: ${_id} not found.${SPLIT_PATTERN}${HTTP_STATUS.ok}`
      );

    rideInfo.driver = driver._id;
    rideInfo.driverETAToPickup = calculateDist("", "", 1, 15); // generate random number from 1 to 15

    // confirm seat is not full and update driver ride count
    const driverRide = await Ride.findOne({ driver: driver._id });
    if (!driverRide)
      throw new Error(
        `driver details not complete, please contact support.${SPLIT_PATTERN}${HTTP_STATUS.ok}`
      );

    if (await driverCarIsFull(driver, driverRide))
      throw new Error(
        `You need to complete a ride before taking another.${SPLIT_PATTERN}${HTTP_STATUS.ok}`
      );

    driverRide.currentRideCount++;
    driverRide.save();

    return await rideInfo.save();
  } catch (err: any) {
    logger.error(err);
    throw err;
  }
}

export async function startActiveRide(
  startRideDto: StartRideDto,
  driver: UserType
) {
  try {
    const rideInfo = await RideInfo.findOne({
      _id: startRideDto.rideId,
    });

    if (!rideInfo || !driver._id.equals(rideInfo.driver))
      throw new Error(`Ride not found.${SPLIT_PATTERN}${HTTP_STATUS.ok}`);

    // any ride wit ETAToDest set has aleready started
    if (rideInfo.rideETAToDest)
      throw new Error(`Ride already started.${SPLIT_PATTERN}${HTTP_STATUS.ok}`);

    rideInfo.rideETAToDest = calculateDist("", "", 1, 50); // generate random number from 1 to 50
    return await rideInfo.save();
  } catch (err: any) {
    logger.error(err);
    throw err;
  }
}

export async function endRide(endRideDto: EndRideDto) {
  try {
    let rideInfo: RideInfoType | null = null;

    // rider ends ride
    if (endRideDto.riderId) {
      rideInfo = await RideInfo.findOne({
        rider: endRideDto.riderId,
        rideComplete: false,
      });

      rideInfo && (rideInfo.rideEndedBy = ACCOUNTS.rider);
    }

    // driver ends ride
    if (endRideDto.driverId) {
      rideInfo = await RideInfo.findOne({
        driver: endRideDto.driverId, // not neccessarily needed
        _id: endRideDto.rideId,
      });

      rideInfo && (rideInfo.rideEndedBy = ACCOUNTS.driver);
    }

    if (!rideInfo)
      throw new Error(
        `Ride not found.${SPLIT_PATTERN}${HTTP_STATUS.badRequest}`
      );

    if (rideInfo.rideComplete)
      throw new Error(
        `Ride already completed.${SPLIT_PATTERN}${HTTP_STATUS.badRequest}`
      );

    rideInfo.rideComplete = true;
    rideInfo.reasonForRideCompletion = endRideDto.reason!!;

    // if no reason is given from route param, set reason to completed
    rideInfo.reasonForRideCompletion =
      rideInfo.reasonForRideCompletion || RIDE_COMPLETE.completed;

    // if driver hasn't started the ride and he is ending the ride then it is cancelled ride
    if (endRideDto.driverId && !rideInfo.rideETAToDest)
      rideInfo.reasonForRideCompletion = RIDE_COMPLETE.cancelled;

    return await rideInfo.save();
  } catch (err: any) {
    logger.error(err);
    throw err;
  }
}

async function driverCarIsFull(driver: UserType, ride: RideType) {
  try {
    const driverCar = await Car.findOne({ owner: driver._id });
    if (!driverCar)
      throw new Error(
        `You don't have a registered, please register a car.${SPLIT_PATTERN}${HTTP_STATUS.ok}`
      );

    return ride.currentRideCount >= driverCar.capacity;
  } catch (err: any) {
    logger.error(err);
    throw err;
  }
}
