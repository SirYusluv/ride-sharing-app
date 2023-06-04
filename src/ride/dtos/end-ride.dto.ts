import { Types } from "mongoose";
import { HTTP_STATUS, SPLIT_PATTERN } from "../../util/data";
import { isValidMongooseObjectId } from "../../util/helper";
import { RIDE_COMPLETE, RIDE_COMPLETE_TYPE } from "../ride-info.schema";

export class EndRideDto {
  driverId: Types.ObjectId | null = null;
  riderId: Types.ObjectId | null = null;
  rideId: Types.ObjectId | null = null;
  reason: RIDE_COMPLETE_TYPE | null = null;

  constructor(
    driverId?: string,
    riderId?: string,
    rideId?: string,
    reason?: string
  ) {
    this.setDriverId(driverId || "");
    this.setRiderId(riderId || "");
    this.setRideId(rideId || "");
    this.validateDriverOrRiderSet();
    this.setReason(reason || "");
  }

  private setDriverId(driverId: string) {
    if (driverId && !isValidMongooseObjectId(driverId))
      throw new Error(
        `Invalid driver id provided.${SPLIT_PATTERN}${HTTP_STATUS.badRequest}`
      );
    this.driverId = driverId ? new Types.ObjectId(driverId) : null;
  }

  private setRiderId(riderId: string) {
    if (!!riderId && !isValidMongooseObjectId(riderId))
      throw new Error(
        `Invalid rider id provided.${SPLIT_PATTERN}${HTTP_STATUS.badRequest}`
      );
    this.riderId = riderId ? new Types.ObjectId(riderId) : null;
  }

  private setRideId(rideId: string) {
    if (!!rideId && !isValidMongooseObjectId(rideId))
      throw new Error(
        `Invalid ride id provided.${SPLIT_PATTERN}${HTTP_STATUS.badRequest}`
      );
    this.rideId = rideId ? new Types.ObjectId(rideId) : null;
  }

  private setReason(reason: string) {
    if (
      reason &&
      !(
        [RIDE_COMPLETE.completed, RIDE_COMPLETE.cancelled] as string[]
      ).includes(reason)
    )
      throw new Error(
        `Invalid reason provided.${SPLIT_PATTERN}${HTTP_STATUS.badRequest}`
      );

    if (!reason) return (this.reason = RIDE_COMPLETE.completed);
    this.reason = reason as RIDE_COMPLETE_TYPE;
  }

  private validateDriverOrRiderSet() {
    if (!this.driverId && !this.riderId)
      throw new Error(
        `No id provided.${SPLIT_PATTERN}${HTTP_STATUS.badRequest}`
      );
  }
}
