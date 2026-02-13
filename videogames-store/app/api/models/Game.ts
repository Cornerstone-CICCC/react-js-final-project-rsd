import mongoose, { Model, Schema } from "mongoose";

export interface IGame extends Document {
  _id: string;
  id: string;
  title: string;

  // ✅ optional for MVP
  description?: string;

  price: number;

  // ✅ optional for MVP
  mainImg?: string;

  subImg: string[];

  category: string;

  stock: number;
  isFeatured: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const GameSchema = new Schema<IGame>(
  {
    id: { type: String, required: true, unique: true },

    title: { type: String, required: true },

    // ✅ MVP: allow empty description
    description: { type: String, default: "" },

    price: { type: Number, required: true },

    // ✅ MVP: allow cover OR mainImg
    mainImg: { type: String, default: "" },

    subImg: { type: [String], default: [] },

    category: { type: String, required: true },

    stock: { type: Number, default: 999 },

    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Game: Model<IGame> =
  mongoose.models.Game || mongoose.model<IGame>("Game", GameSchema);
