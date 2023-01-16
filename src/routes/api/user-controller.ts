import { User, UserModel } from "../../models/user";

//TODO: Transfer control from the users route to the user manager

/** Manages the current users in the database, and provides a quick
 * lookup hashtable for the user's email to their user object.
 */
export class UserManager {
    private static instance: UserManager;
    private userMap: Map<string, User>;

    // Private constructor to prevent instantiation
    private constructor() {
        // Initialize the user map
        this.userMap = new Map<string, User>();
        this.initializeUserMap();
    }

    // Implement Singleton
    static getInstance(): UserManager {
        if (!UserManager.instance) {
            UserManager.instance = new UserManager();
        }
        return UserManager.instance;
    }

    getUserMap(): Map<string, User> {
        return this.userMap;
    }

    /** Adds a user to the user map, if the email already exists, updates the value of it */
    addUser(user: User) {
        this.userMap.set(user.email, user);
    }

    /** Removes a user from the user map */

    removeUser(user: User) {
        this.userMap.delete(user.email);
    }

    /** Returns the user with the given email */
    getUser(email: string): User | undefined {
        return this.userMap.get(email);
    }

    /** Fetch all users from the DB and populates the user map*/
    async initializeUserMap() {
        const users = await UserModel.find();
        users.forEach((user) => {
            this.userMap.set(user.email, user);
        });
    }
}

