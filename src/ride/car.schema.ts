import { Document, model, Schema, Types } from "mongoose";
import { User } from "../user/user.schema";
import { DEFAULT_CAR_CAPACITY } from "../util/data";

export type CarType = Document<unknown, any, ICar> &
  Omit<ICar & { _id: Types.ObjectId }, never>;

interface ICar {
  owner: Types.ObjectId;
  make: string;
  model: string;
  color: string;
  numberPlate: string;
  capacity: number;
  dateRegistered?: Date;
}

const CarSchema = new Schema<ICar>({
  owner: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true,
    unique: true,
  },
  make: { type: String, required: true },
  model: { type: String, required: true },
  color: { type: String, required: true },
  numberPlate: { type: String, required: true, unique: true },
  capacity: { type: Number, default: DEFAULT_CAR_CAPACITY },
  dateRegistered: { type: Date, default: Date.now },
});

export const Car = model<ICar>("Car", CarSchema);
