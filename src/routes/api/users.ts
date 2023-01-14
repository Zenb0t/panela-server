import { Router, RequestHandler } from "express";
import { UserManager } from "src/user-manager";
import { UserModel } from "../../models/user";

const userRouter = Router();

const userMap = UserManager.getInstance().getUserMap();
/** Create a new user */
//TODO: Add validation for email, to avoid creating users with the same email
const create: RequestHandler = (req, res) => {

    const user = new UserModel(req.body);
    if (userMap.has(user.email)) {
        res.status(400).send({ message: `User with email ${user.email} already exists` });
        return;
    } else {
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
}

/** Get user by id */

const getById: RequestHandler = (req, res, next) => {
    const id = req.params.userId;
    console.log("get user by id")
    console.log(id);
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
    next();
}

/** Get user by email  */

const getByEmail: RequestHandler = (req, res, next) => {
    const email = req.params.email;
    console.log("get user by email")
    console.log(email);
    UserModel.findOne({ email: email })
        .then((data) => {
            if (!data) {
                res.status(404).send({ message: `User with email ${email} not found` });
            } else {
                res.header("Access-Control-Allow-Origin", "*");
                res.send(data).status(200);
                console.log(`User found: 200 OK ${data.username}`);
            }
        })
        .catch((err) => {
            res.status(500).send({ message: `Error when getting user with email ${email}` });
        }
        )
    next();
}



userRouter.post("/u", create);
// userRouter.get("/u/:email", getByEmail);
// userRouter.get("/u/:id", getById);

export default userRouter;


