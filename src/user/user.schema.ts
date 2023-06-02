import { Document, model, Schema, Types } from "mongoose";
import { ACCOUNTS, ACCOUNT_TYPES } from "../util/data";

export type UserType = Document<unknown, any, IUser> &
  Omit<IUser & { _id: Types.ObjectId }, never>;

// TODO: get ride details

interface IUser {
  emailAddress: string;
  firstName: string;
  lastName: string;
  password: string;
  address: string;
  contact: string;
  isBlocked?: boolean;
  accountType?: ACCOUNT_TYPES;
  createdDate?: Date;
}

const UserSchema = new Schema<IUser>({
  emailAddress: { type: String, unique: true, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true, select: 0 },
  address: String,
  contact: String,
  isBlocked: { type: Boolean, default: false },
  accountType: { type: String, default: ACCOUNTS.rider },
  createdDate: { type: Date, default: Date.now },
});

export const User = model<IUser>("User", UserSchema);
