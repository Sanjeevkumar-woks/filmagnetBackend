// fn to generate a case-insensitive regular expression query for matching email IDs
export function getEmailIdRegexQuery(emailId: string) {
  //to ensure that special characters(+,-,...) are treated literally when used in the regular expression and match exactly

  console.log(emailId);
  const regexEmailId = emailId.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");

  return { $regex: `^${regexEmailId}$`, $options: "i" };
}
