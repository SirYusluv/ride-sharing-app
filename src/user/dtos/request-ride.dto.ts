import { HTTP_STATUS, SPLIT_PATTERN } from "../../util/data";
import { addressIsValid } from "../../util/helper";

export class RequestRideDto {
  pickupPoint: string | null = null;
  destination: string | null = null;

  constructor(pickupPoint?: string, destination?: string) {
    this.setPickupPoint(pickupPoint || "");
    this.setDestination(destination || "");
  }

  private setPickupPoint(pickupPoint: string) {
    if (!addressIsValid(pickupPoint))
      throw new Error(
        `Invalid address provided for pickup point.${SPLIT_PATTERN}${HTTP_STATUS.badRequest}`
      );
    this.pickupPoint = pickupPoint;
  }

  private setDestination(destination: string) {
    if (!addressIsValid(destination))
      throw new Error(
        `Invalid address provided for destination.${SPLIT_PATTERN}${HTTP_STATUS.badRequest}`
      );
    this.destination = destination;
  }
}
