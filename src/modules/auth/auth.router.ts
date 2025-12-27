import { Router } from "express";
import authController from "./auth.controller";
import validateRequest from "../../middleware/validateRequest";
import { authValidationSchema } from "./auth.validation";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";
import { loginLimiter } from "../../middleware/security";
import { upload } from "../../middleware/multer.middleware";


const router = Router();

router.post(
  "/login",
  loginLimiter,
  validateRequest(authValidationSchema.authValidation),
  authController.login
);

router.post("/refresh-token", authController.refreshToken);
router.post("/forgot-password", authController.forgotPassword);

router.post(
  "/resend-forgot-otp",
  auth(
    USER_ROLE.ADMIN,
    USER_ROLE.CUSTOMER,
    USER_ROLE.SUPPLIER,
    USER_ROLE.DRIVER
  ),
  authController.resendForgotOtpCode
);

router.post(
  "/verify-otp",
  auth(
    USER_ROLE.ADMIN,
    USER_ROLE.CUSTOMER,
    USER_ROLE.SUPPLIER,
    USER_ROLE.DRIVER
  ),
  authController.verifyOtp
);

router.post(
  "/reset-password",
  auth(
    USER_ROLE.ADMIN,
    USER_ROLE.CUSTOMER,
    USER_ROLE.SUPPLIER,
    USER_ROLE.DRIVER
  ),
  authController.resetPassword
);

router.post(
  "/change-password",
  auth(
    USER_ROLE.ADMIN,
    USER_ROLE.CUSTOMER,
    USER_ROLE.SUPPLIER,
    USER_ROLE.DRIVER
  ),
  authController.changePassword
);


// A User who isn't identify as a isn't customer but can register directly as a Driver
// Direct Driver Registration (Includes File Upload)
router.post(
  "/register-driver",
  upload.fields([
    { name: "documents", maxCount: 5 } // Frontend should use 'documents' key for files
  ]),
  validateRequest(authValidationSchema.driverRegistration), // Validate text fields
  authController.registerDriver
);

const authRouter = router;
export default authRouter;
