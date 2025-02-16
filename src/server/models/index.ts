import UserModel from "./user";
import { connectToDatabase } from "@/server/database";

async function ModelInitializer<T>(arg: T): Promise<T> {
    await connectToDatabase();
    return arg;
}

export const User = ModelInitializer(UserModel);