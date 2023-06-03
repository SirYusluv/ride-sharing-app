import { Document, model, Schema, Types } from "mongoose";
import { User } from "../user/user.schema";
import { ACCOUNT_TYPES } from "../util/data";

export type RIDE_COMPLETE_TYPE = "completed" | "cancelled";
export const RIDE_COMPLETE: {
  completed: RIDE_COMPLETE_TYPE;
  cancelled: RIDE_COMPLETE_TYPE;
} = {
  completed: "completed",
  cancelled: "cancelled",
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
  rideEndedBy: ACCOUNT_TYPES;
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
  rideEndedBy: { type: String },
  rideRequestTime: { type: Date, default: Date.now },
});

export const Ride = model<IRide>("Ride", RideSchema);
