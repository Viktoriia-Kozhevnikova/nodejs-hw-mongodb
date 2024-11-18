import mongoose from 'mongoose';


const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;

const DB_URL = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;


export async function initMongoConnection() {
    try {
        await mongoose.connect(DB_URL);
        console.log("Mongo connection successfully established!");
    } catch (error) {
        console.error(error);
        throw (error);
    }
}


