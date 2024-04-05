import mongoose from "mongoose";

export interface IRefreshToken {
  token: String;
  userId: String;
  expireAt: Date;
}

export interface IRefreshTokenDocument
  extends IRefreshToken,
    mongoose.Document {}

export const refreshTokenSchema = new mongoose.Schema<IRefreshToken>(
  {
    token: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    expireAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "RefreshTokens",
  }
);
refreshTokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
refreshTokenSchema.index({ token: 1 });
refreshTokenSchema.index({ userId: 1 });

export const RefreshTokenModelName = "RefreshToken";
