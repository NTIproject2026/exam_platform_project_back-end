import mongoose, { Schema, Types, type HydratedDocument } from "mongoose";
import { paranoidFunction } from "../hooks.js";

export interface IDiploma {
  id?: Types.ObjectId;
  name: string;
  desc: string;
  img?: string;
  createdAt?: Date;
  createdBy?: Types.ObjectId;

  updatedAt?: Date;
  deletedAt?: Date;
  deletedBy?: Types.ObjectId;
}

export const diplomaSchema = new Schema<IDiploma>(
  {
    name: { type: String, required: true },
    desc: { type: String, required: true },
    img: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    deletedAt: { type: Date },
    deletedBy: { type: Types.ObjectId },
  },
  { timestamps: true },
);
paranoidFunction(diplomaSchema);
export type HydratedDiplomaDoc = HydratedDocument<IDiploma>;
export const diplomaModel =
  mongoose.models.diploma || mongoose.model("diploma", diplomaSchema);
