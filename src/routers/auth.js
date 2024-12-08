import express from "express";

import { validateBody } from "../middlewares/validateBody.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

import { registerShema, loginShema } from "../validation/auth.js";
import { registerController, loginController, logoutController, refreshController } from "../controllers/auth.js";


const router = express.Router();
const jsonParser = express.json();

router.post("/register", jsonParser, validateBody(registerShema), ctrlWrapper(registerController));

router.post("/login", jsonParser, validateBody(loginShema), ctrlWrapper(loginController));

router.post("/logout", ctrlWrapper(logoutController));

router.post("/refresh", ctrlWrapper(refreshController));


export default router;
