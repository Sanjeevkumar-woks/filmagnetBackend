import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { getPasswordHash, isValidPassword } from "../constants/bcrypt";
import {
  getAccessToken,
  getInviteToken,
  getRefreshToken,
  getResetToken,
  isValidInviteToken,
  isValidRefreshToken,
} from "../constants/jwt";
import moment from "moment-timezone";
import { UserModel } from "../models/UserModel";
import { RefreshTokenModel } from "../models/RefreshTokenModel";
import config from "config";
import { VerificationTokenModel } from "../models/verificationTokenModel";
import { getEmailIdRegexQuery } from "../constants/common";
import { sendEmail } from "../utils/email";

export async function signUp(payload: { email: string; password: string }) {
  const { email, password } = payload;
  const emailRegexQuery = getEmailIdRegexQuery(email);
  const userExists = await UserModel.findOne({
    email: emailRegexQuery,
    isVerified: true,
  });

  if (userExists) {
    throw new createHttpError.BadRequest(
      "Account with this Email Already Exists"
    );
  }

  const user = await UserModel.create({
    email,
  });

  const frontendUrl = config.get("frontEndUrl");
  const inviteToken = await getInviteToken({
    userId: user._id.toString(),
    password: password,
  });
  const inviteLink = `${frontendUrl}/accept-invite?token=${inviteToken}`;

  await sendEmail({
    from: "sanjeevmanagutti@gmail.com",
    to: email,
    subject: "Invite Link",
    html: `<a href=${inviteLink}>Invite Link</a>`,
  });

  return {inviteToken};
}

export async function verifyUser(payload: {
  token: string;
  userPassword: string;
}) {
  const { token, userPassword } = payload;

  const { data, error } = await isValidInviteToken(token);

  if (error) {
    throw new createHttpError.BadRequest("Invalid token");
  }

  const { userId, password, rememberMe } = data;

  const user = await UserModel.findOne({
    _id: userId,
  });

  if (!user) {
    throw new createHttpError.BadRequest("Invalid token");
  }
  if (userPassword != password) {
    throw new createHttpError.BadRequest("Invalid token");
  }

  if (!user.isVerified) {
    if (!userPassword) {
      return { isVerified: false };
    } else {
      const passwordHash = await getPasswordHash(userPassword);

      await Promise.all([
        UserModel.updateOne(
          { _id: userId },
          { passwordHash, isVerified: true }
        ),
        VerificationTokenModel.deleteOne({ token }),
      ]);

      return { isVerified: true };
    }
  } else {
    await Promise.all([await VerificationTokenModel.deleteOne({ token })]);

    return { isVerified: true };
  }
}

export async function login(payload: {
  email: string;
  password: string;
  rememberMe: boolean;
}) {
  const { email, password, rememberMe } = payload;
  console.log("email",email)
  console.log("password",password)
  console.log("rememberMe",rememberMe)

  const emailRegexQuery = getEmailIdRegexQuery(email);
  const userExists = await UserModel.findOne({
    email: emailRegexQuery,
    isVerified: true,
  });

  if (!userExists) {
    throw new createHttpError.BadRequest("Invalid Credentials");
  }
  const isValid = await isValidPassword(
    password,
    userExists?.passwordHash as string
  );

  if (!isValid) {
    throw new createHttpError.BadRequest("Invalid Credentials");
  }

  const [refreshToken, accessToken] = await Promise.all([
    getRefreshToken(
      {
        userId: userExists._id.toString(),
      },
      rememberMe
    ),
    getAccessToken({
      userId: userExists._id.toString(),
    }),
  ]);

   const expiresInDays = rememberMe
    ? config.get<number>('refreshTokenExpireInDays.withRememberMe')
    : config.get<number>('refreshTokenExpireInDays.withoutRememberMe');

  await RefreshTokenModel.create({
    token: refreshToken,
    userId: userExists._id,
    expireAt: moment().add(expiresInDays, "days").toDate(),
  });

  return { refreshToken, accessToken };
}

export async function forgotPassword(payload: { email: string }) {
  const { email } = payload;

  const emailRegexQuery = getEmailIdRegexQuery(email);

  const userExists = await UserModel.findOne({
    email: emailRegexQuery,
    isVerified: true,
  });
  if (!userExists) {
    return;
  }

  const frontendUrl = config.get("frontEndUrl");
  const resetToken = await getResetToken({ email });
  const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

  await sendEmail({
    from: "sanjeevmanagutti@gmail.com",
    to: email,
    subject: "Reset Password Link",
    html: `<a href=${resetLink}>Reset Password Link</a>`,
  });
}

export async function resetPassword(payload: {
  token: string;
  password: string;
}) {
  const { token, password } = payload;

  const { data, error } = await isValidInviteToken(token);
  if (error) {
    throw new createHttpError.BadRequest("Link Invalid/expired");
  }

  const emailRegexQuery = getEmailIdRegexQuery(data.email);

  const userExists = await UserModel.findOne({
    email: emailRegexQuery,
    isActive: true,
  });

  if (!userExists) {
    throw new createHttpError.BadRequest("Link Invalid/expired");
  }

  const passwordHash = await getPasswordHash(password);

  userExists.passwordHash = passwordHash;
  await Promise.all([
    await VerificationTokenModel.deleteOne({ token }),
    await userExists.save(),
  ]);
}

export async function refreshToken(payload: { refreshToken: string }) {
  const { refreshToken } = payload;
  const refreshTokenData = await isValidRefreshToken(refreshToken);

  if (refreshTokenData.error || !refreshTokenData.data) {
    throw new createHttpError.Unauthorized("Invalid refresh token");
  }
  const refreshTokenExists = await RefreshTokenModel.findOne({
    token: refreshToken,
    userId: refreshTokenData.data.userId,
  });

  if (!refreshTokenExists) {
    throw new createHttpError.Unauthorized("Invalid refresh token");
  }

  const { userId } = refreshTokenData.data;

  const accessToken = await getAccessToken({
    userId,
  });

  return accessToken;
}

export async function logout(payload: { refreshToken: string }) {
  const { refreshToken } = payload;
  const refreshTokenData = jwt.decode(refreshToken) as {
    userId: string;
  };

  await RefreshTokenModel.deleteOne({
    token: refreshToken,
    userId: refreshTokenData?.userId,
  });
}

export async function changePassword(payload: {
  currentPassword: string;
  newPassword: string;
  userId: string;
}) {
  const { currentPassword, newPassword, userId } = payload;

  const userExists = await UserModel.findOne({ _id: userId, isActive: true });

  if (!userExists) {
    throw new createHttpError.BadRequest("Invalid Credentials");
  }

  const isValid = await isValidPassword(
    currentPassword,
    userExists?.passwordHash as string
  );
  if (!isValid) {
    throw new createHttpError.BadRequest("Invalid Credentials");
  }

  const passwordHash = await getPasswordHash(newPassword);
  userExists.passwordHash = passwordHash;
  await userExists.save();
}
