import mongoose, { Model, Schema, Document, Types } from "mongoose";

export interface IOrder extends Document {
  userId: Types.ObjectId;
  games: Types.ObjectId[];
  totalAmount: number;
  status: "pending" | "completed" | "cancelled";
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    games: [{ type: Schema.Types.ObjectId, ref: "Game" }],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
);
