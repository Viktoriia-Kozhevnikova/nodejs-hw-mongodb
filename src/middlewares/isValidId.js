import { isValidObjectId } from "mongoose";
import createHttpError from "http-errors";


export function isValidId(req, res, next) {
    const { contactId } = req.params;

    if (!isValidObjectId(contactId)) {
        return next(createHttpError.NotFound("Contact not found"));
    }

    next();
}