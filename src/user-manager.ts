import { User, UserModel } from "./models/user";

//TODO: Transfer control from the users route to the user manager

/** Manages the current users in the database, and provides a quick
 * lookup hashtable for the user's email to their user object.
 */
export class UserManager {
    private static instance: UserManager;
    private userMap: Map<string, User>;

    private constructor() {
        // Initialize the user map
        this.userMap = new Map<string, User>();
        this.initializeUserMap();
    }

    static getInstance(): UserManager {
        if (!UserManager.instance) {
            UserManager.instance = new UserManager();
        }
        return UserManager.instance;
    }

    getUserMap(): Map<string, User> {
        return this.userMap;
    }

    async initializeUserMap() {
        const users = await UserModel.find();
        users.forEach((user) => {
            this.userMap.set(user.email, user);
        });
    }
}

