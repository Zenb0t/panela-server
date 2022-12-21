import { Router , RequestHandler } from "express";
import { UserModel } from "../../models/user";

const userRouter = Router();

/** Create a new user */

const create: RequestHandler = (req, res) => {
    const user = new UserModel(req.body);
    user.id = user._id;
    user
        .save()
        .then((data) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.send(data).status(200);
            console.log(`User created: 200 OK ${data.username}`);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send({ message: err.message || "Error when creating user" })
        })
}

/** Get user by id */

const getById: RequestHandler = (req, res) => {
    const id = req.params.userId;
    UserModel.findById(id)
        .then((data) => {
            if (!data) {
                res.status(404).send({ message: `User with id ${id} not found` });
            } else {
                res.header("Access-Control-Allow-Origin", "*");
                res.send(data).status(200);
                console.log(`User found: 200 OK ${data.username}`);
            }
        })
        .catch((err) => {
            res.status(500).send({ message: `Error when getting user with id ${id}` });
        }
        )
}

userRouter.post("/", create);
userRouter.get("/:id", getById);

export default userRouter;


