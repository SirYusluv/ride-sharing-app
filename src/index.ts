import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import { HTTP_STATUS, IResponse, SPLIT_PATTERN } from "./util/data";
import { createLogManager } from "simple-node-logger";
import { AuthRouter } from "./auth/auth.router";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const app = express();
const logger = createLogManager().createLogger("index.ts");

// cors
app.use((req, res, next) => {
  const allowedOrigin = [
    req.headers.origin!! || "", // allow any origin for test purpose
  ];
  const origin = req.headers.origin!!;

  res.setHeader(
    "Access-Control-Allow-Origin",
    allowedOrigin.includes(origin) ? origin : allowedOrigin[0]
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).send();
  next();
});

app.use(express.json());

app.use("/auth", AuthRouter);

const errorHandler: ErrorRequestHandler = function (
  err: any,
  _: Request,
  res: Response,
  _1: NextFunction
) {
  try {
    logger.error(err);
    const errMsgAndStatus = (err.message as string).split(SPLIT_PATTERN);
    const message = errMsgAndStatus[0];
    const status = Number(errMsgAndStatus[1]);
    const resMsg: IResponse = {
      message: message || "Error processing your request, please try later.",
      status: status || HTTP_STATUS.internalServerError,
    };
    res.status(status).json(resMsg);
  } catch (e: any) {
    logger.error(e);
    res.status(HTTP_STATUS.internalServerError).json({
      message: "Error processing your request, please try later.",
      status: HTTP_STATUS.internalServerError,
    });
  }
};

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async function () {
  logger.info("Listening on PORT: ", PORT);
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGODB_URI as string);
    logger.info("connection to DB established");
  } catch (err: any) {
    logger.error(err);
  }
});
