import { getAllContacts, getContactById, createContact, updateContact, deleteContact} from "../services/contacts.js";
import createHttpError from "http-errors";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { parseFilterParams } from "../utils/parseFilterParams.js";


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
    const contact = {
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        isFavourite: req.body.isFavourite,
        contactType: req.body.contactType,
        userId: req.user.id
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

    const contact = {
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        isFavourite: req.body.isFavourite,
        contactType: req.body.contactType,
    };


    const result = await updateContact(contactId, userId, contact);

    if (result === null) {
        throw new createHttpError.NotFound("Contact not found");
    }

    res.status(200).send(
        {
            status: 200,
            message: "Successfully patched a contact!",
            data: result
        }
    );
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


