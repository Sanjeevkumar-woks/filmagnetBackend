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

export async function signUp(payload: {
  emailId: string;
  password: string;
  rememberMe: boolean;
}) {
  const { emailId, password, rememberMe } = payload;
  const emailRegexQuery = getEmailIdRegexQuery(emailId);
  const userExists = await UserModel.findOne({
    emailId: emailRegexQuery,
    isVerified: true,
  });

  if (userExists) {
    throw new createHttpError.BadRequest(
      "Account with this Email Already Exists"
    );
  }

  const user = await UserModel.create({
    emailId,
  });

  const frontendUrl = "http://localhost:3000";
  const inviteToken = await getInviteToken({
    userId: user._id.toString(),
    password: password,
    rememberMe: rememberMe,
  });
  const inviteLink = `${frontendUrl}/accept-invite?token=${inviteToken}`;

  // const { error } = await apiClient.sendMail({
  //   recipient: emailId,
  //   mailTemplateName: MailTemplatesEnum.INVITE_CARBON_USER,
  //   metaData: {
  //     invitedByEmail: invitedBy?.emailId,
  //     companyName: company?.name,
  //     inviteLink
  //   },
  //   priority: MailPriorityEnum.HIGH
  // });

  // if (error) {
  //   throw new createHttpError.InternalServerError("Couldn't send invite");
  // }

  return inviteLink;
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
  emailId: string;
  password: string;
  rememberMe: boolean;
}) {
  const { emailId, password, rememberMe } = payload;

  //const emailRegexQuery = getEmailIdRegexQuery(emailId);
  const userExists = await UserModel.findOne({
    emailId: emailId,
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

  const expiresInDays = 30;

  await RefreshTokenModel.create({
    token: refreshToken,
    userId: userExists._id,
    expireAt: moment().add(expiresInDays, "days").toDate(),
  });

  return { refreshToken, accessToken };
}

export async function forgotPassword(payload: { emailId: string }) {
  const { emailId } = payload;

  const emailRegexQuery = getEmailIdRegexQuery(emailId);

  const userExists = await UserModel.findOne({
    emailId: emailRegexQuery,
    isVerified: true,
  });
  if (!userExists) {
    return;
  }

  const frontendUrl = config.get("authWebsiteUrl");
  const resetToken = await getResetToken({ emailId });
  const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

  // const { data, error } = await apiClient.sendMail({
  //   recipient: emailId,
  //   mailTemplateName: MailTemplatesEnum.RESET_PASSWORD,
  //   metaData: {
  //     resetPasswordLink: resetLink
  //   },
  //   priority: MailPriorityEnum.HIGH
  // });
  const error = "";
  if (error) {
    throw new createHttpError.InternalServerError("Couldn't send email");
  }
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

  const emailRegexQuery = getEmailIdRegexQuery(data.emailId);

  const userExists = await UserModel.findOne({
    emailId: emailRegexQuery,
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
