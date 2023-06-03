import { Types } from "mongoose";
import { HTTP_STATUS, SPLIT_PATTERN } from "../../util/data";
import { addressIsValid, isValidMongooseObjectId } from "../../util/helper";

export class AcceptRideDto {
  _id: Types.ObjectId | null = null;

  constructor(_id?: string) {
    this.setId(_id || "");
  }

  private setId(_id: string) {
    if (!isValidMongooseObjectId(_id))
      throw new Error(
        `Invalid ride id provided.${SPLIT_PATTERN}${HTTP_STATUS.badRequest}`
      );
    this._id = new Types.ObjectId(_id);
  }
}
