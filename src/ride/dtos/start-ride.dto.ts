import { Types } from "mongoose";
import { HTTP_STATUS, SPLIT_PATTERN } from "../../util/data";
import { isValidMongooseObjectId } from "../../util/helper";

export class StartRideDto {
  rideId: Types.ObjectId | null = null;

  constructor(rideId?: string) {
    this.setRideId(rideId || "");
  }

  private setRideId(rideId: string) {
    if (!isValidMongooseObjectId(rideId))
      throw new Error(
        `Invalid ride id provided.${SPLIT_PATTERN}${HTTP_STATUS.badRequest}`
      );
    this.rideId = rideId ? new Types.ObjectId(rideId) : null;
  }
}
