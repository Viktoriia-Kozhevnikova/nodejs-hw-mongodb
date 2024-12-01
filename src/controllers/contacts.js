import { getAllContacts, getContactById, createContact, updateContact, deleteContact} from "../services/contacts.js";
import createHttpError from 'http-errors';


export const getAllContactsHandler = async (req, res) => {
    const contacts = await getAllContacts();
    res.status(200).send({
        status: 200,
        message: "Successfully found contacts!",
        data: contacts,
    });
};


export const getContactByIdHandler = async (req, res) => {
    const { contactId } = req.params;

    const contact = await getContactById(contactId);

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

    const contact = {
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        isFavourite: req.body.isFavourite,
        contactType: req.body.contactType,
    };


    const result = await updateContact(contactId, contact);
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
    const result = await deleteContact(contactId);
    if (result === null) {
        throw new createHttpError.NotFound("Contact not found");
    }

    res.status(204).send();
}


