export type NewComment = {
    post: string,
    creator: string,
    text: string
}

export type CommentSchemaType = NewComment & {
    _id: string,
    createdAt: Date,
    updatedAt: Date
}