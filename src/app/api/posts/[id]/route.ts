import { getPostById } from "@/server/helpers/post";

type RequestParam = {
    params: Promise<{ id: string }>
}
export async function GET(req: Request, { params }: RequestParam) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(req.url);
        const targetLanguage = searchParams.get("targetLanguage") ?? "en";
        const post = await getPostById(id, targetLanguage);
        if (!post)
            throw new Error("Post not found");
        return new Response(JSON.stringify({ success: true, post }), { status: 200 });
    } catch (error: unknown) {
        console.error("Error from get post details api route: ", error)
        return new Response(JSON.stringify({
            error: error instanceof Error
                ? error.message
                : "An unknown error occurred"
        }), { status: 500 })
    }
}