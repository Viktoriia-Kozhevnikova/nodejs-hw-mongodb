import express from "express";
import { getAllContactsHandler, getContactByIdHandler, createContactController, updateContactController, deleteContactController } from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { isValidId } from "../middlewares/isValidId.js";
import { validateBody } from "../middlewares/validateBody.js";
import {contactSchemaPost, contactSchemaPatch} from "../validation/contact.js";

const router = express.Router();
const jsonParser = express.json();

router.get("/", ctrlWrapper(getAllContactsHandler));

router.get("/:contactId", isValidId, ctrlWrapper(getContactByIdHandler));

router.post("/", jsonParser, validateBody(contactSchemaPost), ctrlWrapper(createContactController));

router.patch("/:contactId", isValidId, validateBody(contactSchemaPatch), ctrlWrapper(updateContactController));

router.delete("/:contactId", isValidId, ctrlWrapper(deleteContactController));

export default router;
