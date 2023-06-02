import { Router } from "express";
import { signup, signin } from "./auth.service";

export const AuthRouter = Router();
AuthRouter.post("/signup", signup);
AuthRouter.post("/signin", signin);

// same actions sometimes requires different config for different users
// creating differentrt route to factor that
// const AdminRouter = Router();
// const DriverRouter = Router();
// const RiderRouter = Router();

// AuthRouter.use("/admin", AdminRouter);
// AuthRouter.use("/driver", DriverRouter);
// AuthRouter.use("/rider", RiderRouter);

// signup routes
// AdminRouter.post("/signup", adminSignup);
// DriverRouter.post("/signup", driverSignup);
// RiderRouter.post("/signup", riderSignup);
