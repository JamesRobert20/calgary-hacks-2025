export type NewUser = {
    name: string,
    email: string,
    username: string,
    clerkId: string,
    language: string
}

export type FullUserSchema = NewUser & {
    _id: string,
    pushTokens: string[],
    createdAt: Date,
    updatedAt: Date
}