import { Contact } from "../models/contact.js";

export async function getAllContacts({ page, perPage, sortBy, sortOrder, filters, userId }) {

    const skip = page > 0 ? (page - 1) * perPage : 0;
    const contactQuery = Contact.find({userId});


     if (filters.contactType) {
        contactQuery.where("contactType").equals(filters.contactType);
    }

    if (filters.isFavourite !== undefined) {
        contactQuery.where("isFavourite").equals(Boolean(filters.isFavourite));
    }


    const [total, contacts] = await Promise.all([
        Contact.countDocuments(contactQuery),
        contactQuery.sort({[sortBy]: sortOrder}).skip(skip).limit(perPage)
    ]);

    const totalPages = Math.ceil(total / perPage);

    return {
        data: contacts,
        page,
        perPage,
        totalItems: total,
        totalPages,
        hasPreviousPage: totalPages > 1,
        hasNextPage: page < totalPages

    };
}

export async function getContactById(contactId, userId) {
    // return await Contact.findById(contactId);
    return await Contact.findOne({ _id: contactId, userId });
}

export async function createContact(contact) {
    return Contact.create(contact);
};

export async function updateContact(contactId, userId, updates) {
    return Contact.findOneAndUpdate(
        { _id: contactId, userId },
        updates,
        { new: true }
    );
}

export async function deleteContact(contactId, userId) {
    return Contact.findOneAndDelete({ _id: contactId, userId });
}

