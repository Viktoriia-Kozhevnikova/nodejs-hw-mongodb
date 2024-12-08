import mongoose from "mongoose";

const emailValid = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        match: emailValid,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
},
    {
        timestamps: true,
        versionKey: false,
    }
);

userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

export const User = mongoose.model('User', userSchema);
