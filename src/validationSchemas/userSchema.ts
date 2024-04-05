import mongoose from "mongoose";

export interface IUser {
  emailId: string;
  passwordHash?: string;
  isVerified?: boolean;
}

export interface IUserDocument extends IUser, mongoose.Document {}

export const userSchema = new mongoose.Schema<IUser>(
  {
    emailId: {
      type: String,
      required: true,
    },
    passwordHash: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "Users",
  }
);

userSchema.index({ emailId: 1 }, { unique: true });

export const UserModelName = "User";
