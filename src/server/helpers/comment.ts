import { Comment } from "@/server/models";
import { CommentSchemaType, NewComment } from "@/types/comment";
import { translateText } from "./ai";

export async function createComment(comment: NewComment) {
    return (await (await Comment).create(comment));
}

export async function getCommentsByPostId(post: string, targetLanguage: string) {
    const comments = await (await Comment).find({ post }).lean();
    return await Promise.all(comments.map(comment => translateComment(comment, targetLanguage)));
}

export async function translateComment(comment: CommentSchemaType, targetLanguage: string): Promise<CommentSchemaType> {
    return {
        ...comment,
        text: await translateText(comment.text, targetLanguage)
    }
}