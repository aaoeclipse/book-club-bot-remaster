import { addUserDb, getUserDb } from "./infrastructure";
import { UserRoles } from "./user.type";

export const addUser = () => {
    console.log("addUser")
}

export const getCurrUser = async (username: string): Promise<number> => {
    // try to get user
    let user = await getUserDb(username);

    // if no user found, create new user
    if (user === null){
        user = await addUserDb({id:1, username: username, role: UserRoles.default})
    }

    // return id
    return user.id;
}