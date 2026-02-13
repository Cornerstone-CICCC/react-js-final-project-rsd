import mongoose, { Model, Schema } from "mongoose";
import { unique } from "next/dist/build/utils";
import { v4 as uuidv4 } from "uuid";

export interface IUser extends Document {
  id: string;
  password: string;
  email: string;
  isAdmin: boolean;
  whishlist: string[];
  ownedGames: string[];
}

const UserSchema = new Schema<IUser>({
  id:{
       type: String,
      default: () => uuidv4(),
      unique: true,
     },
  password: { type: String, required: true },
  email: { type: String, required: true },
  isAdmin: { type: Boolean, required: false },
  whishlist: [{ type: Schema.Types.ObjectId, ref: "Game" }],
  ownedGames: [{ type: Schema.Types.ObjectId, ref: "Game" }],
});

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
