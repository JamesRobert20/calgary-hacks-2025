export type NewUser = {
    name: string,
    email: string,
    username: string,
    clerkId: string,
}

export type FullUserSchema = {
    _id: string,
    name: string,
    email: string,
    username: string,
    clerkId: string, 
    pushTokens: string[],
    createdAt: Date,
    updatedAt: Date,
}