import mongoose from "mongoose";
import config from "config";
//mongodb+srv://sanjeev:sanjeev143@cluster0.1cfhn.mongodb.net

export const connect = async () => {
  const dbName = config.get("mongodb.dbName");
  const host = config.get("mongodb.host");
  const serviceName = config.get<string>("serviceName");
  const username = process.env.MONGODB_USERNAME;
  const password = process.env.MONGODB_PASSWORD;
  if (!username || !password) {
    console.log("UserName and Password not provided");
  }

  const mongoUrl = `mongodb+srv://${username}:${password}@${host}/${dbName}`;

  await mongoose.connect(mongoUrl, {
    readPreference: "primary",
    connectTimeoutMS: 30000,
    socketTimeoutMS: 20000,
    appName: serviceName,
  });

  console.log(`Connected to MongoDb: ${host}`);
};
