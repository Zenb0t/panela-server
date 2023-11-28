import { Router } from "express";
import { validateUser, checkUserExists, createNewUser, checkUserDoesNotExist, serializeUserByEmail, serializeUserById, updateUserById, deleteUserById } from "./middleware";
const userRouter = Router({ mergeParams: true });

userRouter.post("/u", validateUser, checkUserDoesNotExist, createNewUser);
userRouter.get("/u/email/:email", checkUserExists, serializeUserByEmail);
userRouter.get("/u/id/:id", checkUserExists, serializeUserById);
userRouter.put("/u/id/:id", checkUserExists, validateUser, updateUserById);
// userRouter.delete("/u/id/:id", checkUserExists, deleteUserById);
userRouter.delete("/u/id/:id",  deleteUserById);


export default userRouter;
