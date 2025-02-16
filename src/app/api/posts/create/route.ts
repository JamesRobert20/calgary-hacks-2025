import { createPost } from "@/server/helpers/post";

export async function POST(req: Request) {
    try {
        const { caption, tags, creator, media } = await req.json();
        const post = await createPost({ caption, tags, creator, media });
        return new Response(JSON.stringify({ success: true, post }), { status: 200 });
    } catch (error: unknown) {
        console.error("Error from posts api route: ", error)
        return new Response(JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : "An unknown error occurred"
        }), { status: 500 });
    }
}