import mongoose, { Schema, Types, type HydratedDocument } from "mongoose";
import { UserRoleEnum } from "../../common/enum/UserRoleEnum.js";
import { hashUserPassword, paranoidFunction } from "../hooks.js";

export interface IUser {
  id?: Types.ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
  verificationCode: number;
  verify_otp_time?: Date;
  verified?: boolean;
  forgetPasswordOTP?: number;
  forgetPasswordOTP_Time?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  deletedBy?: Types.ObjectId;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, default: UserRoleEnum.user },
  verificationCode: { type: Number },
  verify_otp_time: { type: Date },
  verified: { type: Boolean },
  forgetPasswordOTP: { type: Number },
  forgetPasswordOTP_Time: { type: Date },
  createdAt: { type: Date },
  updatedAt: { type: Date },
  deletedAt: { type: Date, default: null },
  deletedBy: { type: Types.ObjectId, default: null },
});

hashUserPassword(userSchema);
paranoidFunction(userSchema);

export type HydratedUserDoc = HydratedDocument<IUser>;
export const userModel =
  mongoose.models.users || mongoose.model("users", userSchema);
