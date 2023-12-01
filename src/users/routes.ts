import { Router } from "express";
import { validateUserData, checkUserExists, createNewUser, checkUserDoesNotExist, serializeUserByEmail, serializeUserById, updateUserById, deleteUserById } from "./middleware";
const userRouter = Router({ mergeParams: true });

userRouter.post("/u", validateUserData, checkUserDoesNotExist, createNewUser);
userRouter.get("/u/email/:email", checkUserExists, serializeUserByEmail);
userRouter.get("/u/id/:id", checkUserExists, serializeUserById);
userRouter.put("/u/id/:id", checkUserExists, validateUserData, updateUserById);
userRouter.delete("/u/id/:id", checkUserExists, deleteUserById);


export default userRouter;
