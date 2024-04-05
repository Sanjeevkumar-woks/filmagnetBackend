import express from "express";
import cors from "cors";
import { apis } from "./routes";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/backend", apis);

export default app;
