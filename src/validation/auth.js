import Joi from "joi";

export const registerShema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});


export const loginShema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});
