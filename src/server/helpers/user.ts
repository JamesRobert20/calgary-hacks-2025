import { NewUser } from "@/types/user";
import { User } from "@/server/models";

export async function createUser(user: NewUser) {
    return (await (await User).create(user));
}