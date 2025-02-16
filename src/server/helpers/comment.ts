import { Comment } from "@/server/models";
import { CommentSchemaType, NewComment } from "@/types/comment";
import { translateText } from "./ai";

export async function createComment(comment: NewComment) {
    return (await (await Comment).create(comment));
}

type GetPostCommentsArgs = {
    post: string,
    page: number,
    limit: number
}
export async function getPostComments(args: GetPostCommentsArgs, targetLanguage: string) {
    const { post, page, limit } = args;
    const comments = await (await Comment)
        .find({ post })
        .populate('creator')
        .sort({ "createdAt": "descending" })
        .skip(page * limit)
        .limit(limit)
        .lean();
    return (await Promise.all(comments.map(comment => translateComment(comment, targetLanguage))));
}

export async function getPostCommentsAmount(post: string) {
    return await (await Comment).countDocuments({ post });
}

export async function translateComment(comment: CommentSchemaType, targetLanguage: string): Promise<CommentSchemaType> {
    return {
        ...comment,
        text: await translateText(comment.text, targetLanguage)
    }
}