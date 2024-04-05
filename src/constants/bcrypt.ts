import bcrypt from "bcryptjs";

export async function getPasswordHash(userPassword: string): Promise<string> {
  const passwordHash = await bcrypt.hash(userPassword, 10);
  return passwordHash;
}

export async function isValidPassword(
  userPassword: string,
  passwordHash: string
): Promise<boolean> {
  const isValid = await bcrypt.compare(userPassword, passwordHash);
  return isValid;
}
