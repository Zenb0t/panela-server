import mongoose from "mongoose";
import logger from "./utils/logger";

async function initDB(uri: string) {
	logger.info("Connecting to MongoDB...");
	mongoose.connect(uri).then(
		() => {
			logger.info("Connected to MongoDB");
		},
		(err) => {
			logger.info("Error connecting to MongoDB: ", err);
		}
	);
}

export default initDB;
