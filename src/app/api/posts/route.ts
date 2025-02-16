import { searchPosts } from "@/server/helpers/post";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const targetLanguage = searchParams.get("targetLanguage") ?? "en";
        const page = parseInt(searchParams.get("page") ?? "0");
        const limit = parseInt(searchParams.get("limit") ?? "10");
        const sortParam = searchParams.get("sort")
            ? JSON.parse(searchParams.get("sort") ?? "{ createdAt: 'descending' }")
            : { createdAt: "descending" };
        const searchTerm = searchParams.get("searchTerm") ?? "";
        const posts = await searchPosts({ searchTerm, page, limit, sortParam }, targetLanguage);
        return new Response(JSON.stringify({ success: true, posts }), { status: 200 });
    } catch (error: unknown) {
        console.error("Error from posts api route: ", error)
        return new Response(JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : "An unknown error occurred"
        }), { status: 500 });
    }
}