import mongoose from "mongoose";

export interface IVerificationToken {
  token: string;
  userId?: mongoose.Types.ObjectId | string;
}

export interface IVerificationTokenDocument
  extends IVerificationToken,
    mongoose.Document {}

export const verificationTokenSchema = new mongoose.Schema<IVerificationToken>(
  {
    token: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true, collection: "VerificationTokens" }
);

verificationTokenSchema.index({ token: 1 });
verificationTokenSchema.index({ userId: 1 });

export const VerificationTokenModelName = "VerificationToken";
