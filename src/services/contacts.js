import { Contact } from "../models/contact.js";

export async function getAllContacts() {
    return await Contact.find();
}

export async function getContactById(contactId) {
    return await Contact.findById(contactId);
}

export async function createContact(contact) {
    return Contact.create(contact);
};

export async function updateContact(contactId, contact) {
    return Contact.findByIdAndUpdate(contactId, contact, {new:true});
};

export async function deleteContact(contactId) {
    return Contact.findByIdAndDelete(contactId);
};

