import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import path from "node:path";

import pinoHttp from "pino-http";
import contactsRoutes from "./routers/contacts.js";
import authRoutes from "./routers/auth.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { authenticate } from "./middlewares/authenticate.js";


export async function setupServer() {
    const app = express();
    const PORT = process.env.PORT || 3000;

    const logger = pinoHttp();

    app.use("/photos", express.static(path.resolve("public/photos")));

    app.use(logger);
    app.use(cors());
    app.use(cookieParser());
    app.use(express.json());

    app.use("/auth", authRoutes);
    app.use("/contacts", authenticate, contactsRoutes);


    app.use(notFoundHandler);
    app.use(errorHandler);


    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
