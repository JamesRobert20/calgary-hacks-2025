import { Post } from "@/server/models";
import { NewPost, PostSchemaType } from "@/types/post";
import { translateText } from "./ai";

export async function createPost(post: NewPost) {
    return (await (await Post).create(post));
}

type SearchPostsArgs = {
    searchTerm: string,
    page: number,
    limit: number,
    sortParam: { [key: string]: "ascending" | "descending" }
}
export async function searchPosts({ searchTerm, page, limit, sortParam }: SearchPostsArgs, targetLanguage: string): Promise<PostSchemaType[]> {
    const theKey = sortParam ? Object.keys(sortParam)[0] : "createdAt";
    const sort = sortParam ? { [theKey]: sortParam[theKey] === "ascending" ? 1 : -1 } : { createdAt: -1 };

    if (!!searchTerm) {
        return await Promise.all((await (await Post).aggregate([
            {
                $search: {
                    index: "posts_search_index",
                    text: {
                        query: searchTerm,
                        path: ["caption", "tags"],
                        fuzzy: {
                            maxEdits: 2,
                            prefixLength: 0,
                            maxExpansions: 50
                        }
                    },
                    returnStoredSource: true
                }
            },
            { $addFields: { userId: { $toObjectId: "$creator" } } },
            {
                $lookup: {
                    from: 'Users',
                    let: { userId: "$userId" },
                    pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$userId"] } } }],
                    as: 'userDetails'
                }
            },
            { $unwind: '$userDetails' },
            { $addFields: { creator: "$userDetails" } },
            { $sort: sort as { [key: string]: 1 | -1 } },
            { $skip: page * limit },
            { $limit: limit }
        ]))
            .map(post => translatePost(post, targetLanguage)));
    }

    return await Promise.all((await (await Post)
        .find({})
        .populate('creator')
        .sort(sortParam)
        .skip(page * limit)
        .limit(limit)
        .lean()
    ).map(post => translatePost(post, targetLanguage)));
}

export async function translatePost(post: PostSchemaType, targetLanguage: string): Promise<PostSchemaType> {
    const [translatedTitle, translatedCaption, translatedTags] = await Promise.all([
        translateText(post.title, targetLanguage),
        post.caption ? translateText(post.caption, targetLanguage) : Promise.resolve(""),
        Promise.all(post.tags.map(tag => translateText(tag, targetLanguage)))
    ]);

    return {
        ...post,
        title: translatedTitle,
        caption: translatedCaption,
        tags: translatedTags
    }
}

export async function getPostById(id: string, targetLanguage: string): Promise<PostSchemaType | null> {
    const post = await (await Post).findById(id).lean();
    if (post)
        return (await translatePost(post, targetLanguage));
    return null;
}