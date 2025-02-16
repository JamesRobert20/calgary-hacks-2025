import { getPostComments, getPostCommentsAmount } from "@/server/helpers/comment";

type RequestParam = {
    params: Promise<{ id: string }>
}
export async function GET(req: Request, { params }: RequestParam) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(req.url);
        const amountOnly = (searchParams.get('amountOnly') ?? "false") === 'true';
        const page = searchParams.get('page') ? Number(searchParams.get('page')) : 0;
        const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 10;
        const targetLanguage = searchParams.get("targetLanguage") ?? "en";
        const comments = amountOnly
            ? await getPostCommentsAmount(id)
            : await getPostComments({ post: id, page, limit }, targetLanguage);
        return new Response(JSON.stringify({ success: true, comments }), { status: 200 });
    } catch (error: unknown) {
        console.error("Error from getComments api route: ", error)
        return new Response(JSON.stringify({
            error: error instanceof Error
                ? error.message
                : "An unknown error occurred"
        }), { status: 500 })
    }
}