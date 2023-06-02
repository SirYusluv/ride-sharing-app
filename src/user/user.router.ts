import { Router } from "express";
import { isUserAdminUserGuard } from "../guards/is-admin.guard";
import { isUserDriverGuard } from "../guards/is-driver.guard";
import { isUserRiderGuard } from "../guards/is-rider.guard";
import { adminModifyUser } from "./admin.service";
import { userModifyUser } from "./user.service";
import { registerCar, unregisterCar } from "./driver.service";

export const UserRouter = Router();

const AdminRouter = Router();
const DriverRouter = Router();
const RiderRouter = Router();

UserRouter.use("/admin", isUserAdminUserGuard, AdminRouter);
UserRouter.use("/driver", isUserDriverGuard, DriverRouter);
UserRouter.use("/rider", isUserRiderGuard, RiderRouter);

AdminRouter.patch("/modify", adminModifyUser);
UserRouter.patch("/modify", userModifyUser);

DriverRouter.post("/register-car", registerCar);
DriverRouter.delete("/unregister-car/:numberPlate", unregisterCar);
