import { Document, model, Schema, Types } from "mongoose";
import { User } from "../user/user.schema";

export type RIDE_COMPLETE_TYPE = "Complete" | "Cancelled";
export const RIDE_COMPLETE: {
  complete: RIDE_COMPLETE_TYPE;
  cancelled: RIDE_COMPLETE_TYPE;
} = {
  complete: "Complete",
  cancelled: "Cancelled",
};

export type RideType = Document<unknown, any, IRide> &
  Omit<IRide & { _id: Types.ObjectId }, never>;

// points/address are supposed to be in [long, lat]
// but since this is a dummy API and I'm not neccessarily calculating realtime distance, I'll be using string
interface IRide {
  rider: Types.ObjectId;
  driver: Types.ObjectId;
  pickupPoint: string;
  destination: string;
  distanceFromPickupToDest: number;
  driverETAToPickup: number; // min
  rideETAToDest: number; // min
  rideComplete: boolean;
  reasonForRideCompletion: RIDE_COMPLETE_TYPE;
  rideRequestTime: Date;
}

const RideSchema = new Schema<IRide>({
  rider: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  driver: { type: Schema.Types.ObjectId, ref: User },
  pickupPoint: { type: String, required: true },
  destination: { type: String, required: true },
  distanceFromPickupToDest: { type: Number, required: true }, // km
  driverETAToPickup: { type: Number },
  rideETAToDest: { type: Number },
  rideComplete: { type: Boolean, default: false },
  reasonForRideCompletion: { type: String },
  rideRequestTime: { type: Date, default: Date.now },
});

export const Ride = model<IRide>("Ride", RideSchema);
