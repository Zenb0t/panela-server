import express from "express";
import sanitizedConfig from "./config";
import recipeRouter from "./recipes/routes";
import initDB from "./database";
import ingredientRouter from "./ingredients/routes";
import userRouter from "./users/routes";
// import { User, UserModel } from './models/user';
import globalMiddleware, { authMiddleware } from "./middleware";
import logger from "./utils/logger";
import { scrapperRouter } from "./scrapper/routes";

const app = express();
app.use(globalMiddleware);

app.listen(sanitizedConfig.PORT, () => {
	logger.info(
		`⚡️[server]: Server is running at localhost:${sanitizedConfig.PORT}`
	);
});

//initialize database
initDB(sanitizedConfig.LOCAL_URI_MONGODB); // TODO: change to URI_MONGODB after testing

// app.use("/api", authMiddleware, userRouter);
app.use("/api", userRouter); // TODO: add auth back in
userRouter.use("/s/", scrapperRouter);
userRouter.use("/u/", recipeRouter);
userRouter.use("/u/", ingredientRouter);
// userRouter.use("/u/", scrapperRouter);
