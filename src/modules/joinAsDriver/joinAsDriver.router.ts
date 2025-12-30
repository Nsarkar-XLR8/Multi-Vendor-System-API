import { Router } from "express";
import auth from "../../middleware/auth";
import { upload } from "../../middleware/multer.middleware";
import { USER_ROLE } from "../user/user.constant";
import { joinAsDriverController } from "./joinAsDriver.controller";
import { optionalAuth } from "../../middleware/optionalAuth";

const router = Router();



// --- DRIVER SELF-SERVICE ---
// Access: {{baseUrl}}/driver/my-info
router.get(
  "/my-info",
  auth(USER_ROLE.DRIVER),
  joinAsDriverController.getMyDriverInfo
);

router.patch(
  "/update-my-info",
  auth(USER_ROLE.DRIVER),
  joinAsDriverController.updateMyProfile
);

// --- ADMIN MANAGEMENT ---
// Access: {{baseUrl}}/admin/driver/all-drivers
router.get(
  "/all-drivers",
  auth(USER_ROLE.ADMIN),
  joinAsDriverController.getAllDrivers
);

// Access: {{baseUrl}}/admin/driver/suspend/:id
router.put(
  "/suspend/:id",
  auth(USER_ROLE.ADMIN),
  joinAsDriverController.suspendDriver
);

// Access: {{baseUrl}}/admin/driver/unsuspend/:id
router.put(
  "/unsuspend/:id",
  auth(USER_ROLE.ADMIN),
  joinAsDriverController.unsuspendDriver
);

// Access: {{baseUrl}}/admin/driver/single/:id
router.get(
  "/single/:id",
  auth(USER_ROLE.ADMIN),
  joinAsDriverController.getSingleDriver
);

// Access: {{baseUrl}}/admin/driver/update-status/:id
router.put(
  "/update-status/:id",
  auth(USER_ROLE.ADMIN),
  joinAsDriverController.updateDriverStatus
);

// Access: {{baseUrl}}/admin/driver/delete/:id
router.delete(
  "/delete/:id",
  auth(USER_ROLE.ADMIN),
  joinAsDriverController.deleteDriver
);


// Public route for first-time visitors and Also Checking if user is logged in
router.post(
  "/register-unified",
  optionalAuth, // Extracts user info IF token exists, else moves on
  upload.fields([{ name: "documents", maxCount: 5 }]),
  joinAsDriverController.registerDriverUnified
);


export default router;
