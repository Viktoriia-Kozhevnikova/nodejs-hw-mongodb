import express from "express";

import { validateBody } from "../middlewares/validateBody.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

import { registerShema, loginShema, requestResetPasswordSchema, resetPasswordSchema } from "../validation/auth.js";
import { registerController, loginController, logoutController, refreshController, requestResetPasswordController, resetPasswordController } from "../controllers/auth.js";


const router = express.Router();
const jsonParser = express.json();

router.post("/register", jsonParser, validateBody(registerShema), ctrlWrapper(registerController));

router.post("/login", jsonParser, validateBody(loginShema), ctrlWrapper(loginController));

router.post("/logout", ctrlWrapper(logoutController));

router.post("/refresh", ctrlWrapper(refreshController));

router.post("/send-reset-email", jsonParser, validateBody(requestResetPasswordSchema), ctrlWrapper(requestResetPasswordController));

router.post("/reset-pwd", jsonParser , validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));


export default router;
