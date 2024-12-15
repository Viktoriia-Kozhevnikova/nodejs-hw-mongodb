import * as fs from "node:fs/promises";
import path from "node:path";

import { getAllContacts, getContactById, createContact, updateContact, deleteContact } from "../services/contacts.js";
import createHttpError from "http-errors";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { parseFilterParams } from "../utils/parseFilterParams.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";


export const getAllContactsHandler = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filters = parseFilterParams(req.query);

    const contacts = await getAllContacts({page, perPage, sortBy, sortOrder, filters, userId: req.user.id});
    res.status(200).send({
        status: 200,
        message: "Successfully found contacts!",
        data: contacts,
    });
};


export const getContactByIdHandler = async (req, res) => {
    const { contactId } = req.params;
    const { id: userId } = req.user;


    const contact = await getContactById(contactId, userId);

    if (!contact) {
        throw new createHttpError.NotFound("Contact not found");
    }


    res.status(200).send({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
    });
};


export async function createContactController(req, res) {
    let photo = null;

    if (typeof req.file !== "undefined") {
        if (process.env.ENABLE_CLOUDINARY === "true") {
            const result = await uploadToCloudinary(req.file.path);
            await fs.unlink(req.file.path);

            photo = result.secure_url;

        } else {
            await fs.rename(req.file.path, path.resolve("src", "public", "photos", req.file.filename));

            photo = `http://localhost:3000/photos/${req.file.filename}`;
        }
    }

    const contact = {
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        isFavourite: req.body.isFavourite,
        contactType: req.body.contactType,
        userId: req.user.id,
        photo
    };

    const result = await createContact(contact);

    res.status(201).send({
        status: 201,
        message: "Successfully created a contact!",
        data: result
    });
};

export async function updateContactController(req, res) {
    const { contactId } = req.params;
    const { id: userId } = req.user;

    let photo = null;

    if (typeof req.file !== "undefined") {
        if (process.env.ENABLE_CLOUDINARY === "true") {

            const result = await uploadToCloudinary(req.file.path);
            await fs.unlink(req.file.path);
            photo = result.secure_url;
        } else {
            await fs.rename(req.file.path, path.resolve("src", "public", "photos", req.file.filename));
            photo = `http://localhost:3000/photos/${req.file.filename}`;
        }
    }

    const contact = {
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        isFavourite: req.body.isFavourite,
        contactType: req.body.contactType,
        ...(photo && { photo }) 
    };

    const result = await updateContact(contactId, userId, contact);

    if (result === null) {
        throw new createHttpError.NotFound("Contact not found");
    }

    res.status(200).send({
        status: 200,
        message: "Successfully patched a contact!",
        data: result
    });
}

export async function deleteContactController(req, res) {
    const { contactId } = req.params;
    const { id: userId } = req.user;

    const result = await deleteContact(contactId, userId);

    if (result === null) {
        throw new createHttpError.NotFound("Contact not found");
    }

    res.status(204).send();
}


