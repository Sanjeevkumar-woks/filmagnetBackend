import jwt from "jsonwebtoken";
import config from "config";
import { VerificationTokenModel } from "../models/verificationTokenModel";
export async function getRefreshToken(
  payload: {
    userId: string;
  },
  rememberMe: boolean
): Promise<string> {
  const expiresIn = rememberMe ? 90 : 30;
  const token = await jwt.sign(
    payload,
    process.env.JWT_REFRESH_PRIVATE_KEY as string,
    {
      expiresIn: `${expiresIn}d`,
    }
  );
  return token;
}

export async function getAccessToken(payload: {
  userId: string;
}): Promise<string> {
  const expiresIn = 30;

  const token = await jwt.sign(payload, process.env.JWT_PRIVATE_KEY as string, {
    expiresIn: `${expiresIn}h`,
  });
  return token;
}

export async function isValidInviteToken(
  token: string
): Promise<{ data: any; error: boolean }> {
  try {
    const data = await jwt.verify(
      token,
      process.env.VERIFICATION_JWT_KEY as string
    );

    const verificationToken = await VerificationTokenModel.findOne({
      token,
    });

    if (!verificationToken) {
      return { data: null, error: true };
    }

    return { data, error: false };
  } catch (err) {
    return { data: null, error: true };
  }
}

export async function getResetToken(payload: {
  emailId: string;
}): Promise<string> {
  const expiresIn = config.get<string>("resetTokenExpire");

  const token = await jwt.sign(
    payload,
    process.env.VERIFICATION_JWT_KEY as string,
    {
      expiresIn,
    }
  );

  await VerificationTokenModel.create({
    token,
  });

  return token;
}

export async function isValidResetToken(
  token: string
): Promise<{ data: any; error: boolean }> {
  try {
    const data = await jwt.verify(
      token,
      process.env.VERIFICATION_JWT_KEY as string
    );

    const verificationToken = await VerificationTokenModel.findOne({
      token,
    });

    if (!verificationToken) {
      return { data: null, error: true };
    }

    return { data, error: false };
  } catch (err) {
    return { data: null, error: true };
  }
}

export async function generateOauthToken(payload: { companyId: string }) {
  try {
    const expiresIn = "30d";

    const token = await jwt.sign(
      payload,
      process.env.OAUTH_TOKEN_PRIVATE_KEY as string,
      {
        expiresIn,
      }
    );

    return { token, error: false };
  } catch (err) {
    return { token: null, error: true };
  }
}

export async function isValidToken(
  token: string,
  privateKey: string
): Promise<{ data: any; error: boolean }> {
  try {
    const data = await jwt.verify(token, privateKey);

    return { data, error: false };
  } catch (err) {
    return { data: null, error: true };
  }
}

export async function isValidAccessToken(token: string) {
  return await isValidToken(token, process.env.JWT_PRIVATE_KEY as string);
}

export async function isValidRefreshToken(token: string) {
  return await isValidToken(
    token,
    process.env.JWT_REFRESH_PRIVATE_KEY as string
  );
}

export async function getInviteToken(payload: {
  userId: string;
  password: string;
}): Promise<string> {
  const expiresIn = "7d";

  const token = await jwt.sign(
    payload,
    process.env.VERIFICATION_JWT_KEY as string,
    {
      expiresIn,
    }
  );

  await VerificationTokenModel.create({
    token,
    userId: payload.userId,
  });

  return token;
}
