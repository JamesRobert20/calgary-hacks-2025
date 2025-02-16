import { MediaType } from ".";

export type NewPost = {
    caption?: string,
    media?: {
        path: string,
        type: MediaType
    }[],
    creator: string,
    tags: string[]
}

export type PostSchemaType = NewPost & {
    _id: string,
    createdAt: Date,
    updatedAt: Date
}