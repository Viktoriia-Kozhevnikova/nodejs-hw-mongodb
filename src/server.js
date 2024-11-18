import cors from "cors";
import express from "express";
import pinoHttp from "pino-http";
import { getAllContacts, getContactById } from "./services/contacts.js";


export async function setupServer() {
    const app = express();
    const PORT = process.env.PORT || 3000;

    const logger = pinoHttp();

    app.use(logger);
    app.use(cors());


    app.get("/contacts", async (req, res) => {
        try {
            const contacts = await getAllContacts();
            res.status(200).send({
                status: 200,
                message: "Successfully found contacts!",
                data: contacts,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: "An error occurred while fetching contacts.",
            });
        }
    });


    app.get("/contacts/:contactId", async (req, res) => {
        const { contactId } = req.params;

        try {
            const contact = await getContactById(contactId);

            if (!contact) {
                return res.status(404).send({
                    message: 'Contact not found',
                });
            }

            res.status(200).send({
                status: 200,
                message: `Successfully found contact with id ${contactId}!`,
                data: contact,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: "An error occurred while fetching the contact.",
            });
        }
    });


    app.use((req, res, next) => {
        res.status(404).send({
            status: 404,
            message: "Not found",
        });
    });


    app.use((error, req, res, next) => {
        req.log.error(error);
        res.status(500).send({
            status: 500,
            message: "Internal Server Error",
        });
    });


    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

}
