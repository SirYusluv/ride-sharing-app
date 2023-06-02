import { Document, model, Schema, Types } from "mongoose";

export type CarType = Document<unknown, any, ICar> &
  Omit<ICar & { _id: Types.ObjectId }, never>;

interface ICar {
  ownerEmailAddress: string;
  make: string;
  model: string;
  color: string;
  numberPlate: string;
  dateRegistered?: Date;
}

const CarSchema = new Schema<ICar>({
  ownerEmailAddress: { type: String, required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  color: { type: String, required: true },
  numberPlate: { type: String, required: true, unique: true },
  dateRegistered: { type: Date, default: Date.now },
});

export const Car = model<ICar>("Car", CarSchema);
