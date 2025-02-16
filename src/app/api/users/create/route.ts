import { createUser } from "@/server/helpers/user";

export async function POST(req: Request) {
    try {
        const { username, name, clerkId, email, language } = await req.json();
        const user = await createUser({ username, name, clerkId, email, language });
        return new Response(JSON.stringify({ success: true, user }), { status: 201 });
    } catch (error: unknown) {
        console.error("Error from create user api route: ", error)
        return new Response(JSON.stringify({
            error: error instanceof Error
                ? error.message
                : 'An unknown error occurred'
        }), { status: 500 })
    }
}