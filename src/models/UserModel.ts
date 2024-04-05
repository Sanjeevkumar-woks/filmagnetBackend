import mongoose from "mongoose";
import {
  IUser,
  UserModelName,
  userSchema,
} from "../validationSchemas/userSchema";

export const UserModel = mongoose.model<IUser>(UserModelName, userSchema);
