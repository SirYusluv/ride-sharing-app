import { Router } from "express";
import { isUserAdminUserGuard } from "../guards/is-admin.guard";
import { isUserDriverGuard } from "../guards/is-driver.guard";
import { isUserRiderGuard } from "../guards/is-rider.guard";
import { adminModifyUser } from "./admin.service";
import { userModifyUser } from "./user.service";
import {
  acceptRide,
  driverEndRide,
  findDriverUncompletedRides,
  findRides,
  registerCar,
  startRide,
  unregisterCar,
} from "./driver.service";
import { requestRide, riderEndRide } from "./rider.service";
import { isUserNotBlockedGuard } from "../guards/is-user-not-blocked.guard";

export const UserRouter = Router();

const AdminRouter = Router();
const DriverRouter = Router();
const RiderRouter = Router();

UserRouter.use("/admin", isUserAdminUserGuard, AdminRouter);
UserRouter.use(
  "/driver",
  isUserDriverGuard,
  isUserNotBlockedGuard,
  DriverRouter
);
UserRouter.use("/rider", isUserRiderGuard, isUserNotBlockedGuard, RiderRouter);

AdminRouter.patch("/modify", adminModifyUser);
UserRouter.patch("/modify", userModifyUser);

DriverRouter.post("/register-car", registerCar);
DriverRouter.patch("/unregister-car/:numberPlate", unregisterCar);

RiderRouter.post("/request-ride", requestRide);

// find rides to accept
DriverRouter.get("/find-rides", findRides);

DriverRouter.get("/uncompleted-rides", findDriverUncompletedRides);

DriverRouter.patch("/accept-ride/:_id", acceptRide);

DriverRouter.patch("/start-ride/:rideId", startRide);

DriverRouter.get("/end-ride/:rideId", driverEndRide);

RiderRouter.get("/end-ride", riderEndRide);
