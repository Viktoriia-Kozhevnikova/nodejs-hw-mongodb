import express from "express";
import { getAllContactsHandler, getContactByIdHandler, createContactController, updateContactController, deleteContactController } from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const router = express.Router();
const jsonParser = express.json();

router.get("/", ctrlWrapper(getAllContactsHandler));
router.get("/:contactId", ctrlWrapper(getContactByIdHandler));

router.post("/", jsonParser, ctrlWrapper(createContactController));

router.patch("/:contactId", ctrlWrapper(updateContactController));

router.delete("/:contactId", ctrlWrapper(deleteContactController));

export default router;



// import express from "express";

// import { getAllContacts, getContactById } from "./services/contacts.js";

// const router = express.Router();

// router.get("/", async (req, res) => {
//         try {
//             const contacts = await getAllContacts();
//             res.status(200).send({
//                 status: 200,
//                 message: "Successfully found contacts!",
//                 data: contacts,
//             });
//         } catch (error) {
//             console.error(error);
//             res.status(500).send({
//                 message: "An error occurred while fetching contacts.",
//             });
//         }
//     });


// router.get("/:contactId", async (req, res) => {
//     const { contactId } = req.params;

//     try {
//         const contact = await getContactById(contactId);

//         if (!contact) {
//             return res.status(404).send({
//                 message: 'Contact not found',
//             });
//         }

//         res.status(200).send({
//             status: 200,
//             message: `Successfully found contact with id ${contactId}!`,
//              data: contact,
//         });
//      } catch (error) {
//         console.error(error);
//         res.status(500).send({
//             message: "An error occurred while fetching the contact.",
//         });
//     }
// });
// export default router;





















