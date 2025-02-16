import UserModel from "./user";
import PostModel from "./post";
import CommentModel from "./comment";
import { connectToDatabase } from "@/server/database";

async function ModelInitializer<T>(arg: T): Promise<T> {
    await connectToDatabase();
    return arg;
}

export const User = ModelInitializer(UserModel);
export const Post = ModelInitializer(PostModel);
export const Comment = ModelInitializer(CommentModel);