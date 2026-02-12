import mongoose, { Model, Schema } from "mongoose";

export interface IGame extends Document {
  _id: string;
  title: string;
  description: string;
  price: number;
  mainImg: string;
  subImg: string[];
  category: string;
  stock: number;
  isFeatured: boolean;
  createdAt: Date;
  updatesAt: Date;
}

const GameSchema = new Schema<IGame>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    mainImg: { type: String, required: true },
    subImg: { type: [String], default: [] },
    category: { type: String, required: true },
    stock: { type: Number, default: 999 },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Game: Model<IGame> =
  mongoose.models.Game || mongoose.model<IGame>("Game", GameSchema);
