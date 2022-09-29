import mongoose from "mongoose";
import sanitizedConfig from "./config";

async function initDB(uri: string) {
    console.log("Connecting to MongoDB...");
    mongoose.connect(uri).then(
        () => {
            console.log("Connected to MongoDB");
        },
        err => {
            console.log("Error connecting to MongoDB: ", err);
        }
    );
}


export default initDB;