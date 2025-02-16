import { getPresignedUrl } from "@/server/helpers/media";

export async function POST(req: Request) {
    try {
        const { Key, ContentType } = await req.json();
        const presignedUrl = await getPresignedUrl(Key, ContentType);
        return new Response(JSON.stringify({ success: true, presignedUrl }), { status: 201 });
    } catch (error: unknown) {
        console.error("Error from presignedurl api route: ", error)
        return new Response(JSON.stringify({
            error: error instanceof Error
                ? error.message
                : "An unknown error occurred"
        }), { status: 500 })
    }
}