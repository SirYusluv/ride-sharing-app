import { Document, model, Schema, Types } from "mongoose";
import { User } from "../user/user.schema";

export type RideType = Document<unknown, any, IRide> &
  Omit<IRide & { _id: Types.ObjectId }, never>;

interface IRide {
  driver: Types.ObjectId;
  // number of passengers driver is currently transporting
  currentRideCount: number;
}

const RideSchema = new Schema<IRide>({
  driver: { type: Schema.Types.ObjectId, ref: User, required: true },
  currentRideCount: { type: Number, default: 0 },
});

export const Ride = model<IRide>("Ride", RideSchema);
