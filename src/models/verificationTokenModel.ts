import mongoose from "mongoose";
import {
  IVerificationToken,
  VerificationTokenModelName,
  verificationTokenSchema,
} from "../validationSchemas/verificationTokenSchema";

export const VerificationTokenModel = mongoose.model<IVerificationToken>(
  VerificationTokenModelName,
  verificationTokenSchema
);
