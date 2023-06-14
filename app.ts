import express, { Router } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { authRoute, userRoute } from "./routes";

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO_URL!).then((params) => {
  app.listen(process.env.PORT || 8080);
});

app.use(express.json());

app.get("/", (req, res, next) => {
  res.send("Hello world");
});

const useRouter = (api: string, ...routes: Router[]) => {
  app.use(`/api/v1/${api}`, ...routes);
};

useRouter("user", userRoute);
useRouter("auth", authRoute);
