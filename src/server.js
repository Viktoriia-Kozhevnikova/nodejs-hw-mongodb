import cors from "cors";
import express from "express";
import pinoHttp from "pino-http";
import contactsRouter from "./routers/contacts.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";




export async function setupServer() {
    const app = express();
    const PORT = process.env.PORT || 3000;

    const logger = pinoHttp();

    app.use(logger);
    app.use(cors());
    app.use(express.json());


    app.use("/contacts", contactsRouter);


    app.use(notFoundHandler);
    app.use(errorHandler);


    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
