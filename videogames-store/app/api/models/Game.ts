import mongoose, { Model, Schema } from "mongoose";

export interface IGame extends Document {
  _id: string;
  title: string;

  description?: string;
  price: number;
  mainImg?: string;
  subImg: string[];
  category: string;

  stock: number;
  isFeatured: boolean;

  // ✅ NEW
  isTrending: boolean;
  releaseDate?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const GameSchema = new Schema<IGame>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    mainImg: { type: String, default: "" },
    subImg: { type: [String], default: [] },
    category: { type: String, required: true },

    stock: { type: Number, default: 999 },
    isFeatured: { type: Boolean, default: false },

    
    isTrending: { type: Boolean, default: false },
    releaseDate: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Game: Model<IGame> =
  mongoose.models.Game || mongoose.model<IGame>("Game", GameSchema);
