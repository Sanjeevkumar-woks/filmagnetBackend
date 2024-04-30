// fn to generate a case-insensitive regular expression query for matching email IDs
export function getEmailIdRegexQuery(email: string) {
  //to ensure that special characters(+,-,...) are treated literally when used in the regular expression and match exactly

  console.log(email);
  const regexEmailId = email.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");

  return { $regex: `^${regexEmailId}$`, $options: "i" };
}
