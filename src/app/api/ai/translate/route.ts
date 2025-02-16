import { translateText } from "@/server/helpers/ai";

export async function POST(req: Request) {
    try {
        const { text } = await req.json();
        const translatedText = await translateText(text);
        return new Response(JSON.stringify({ success: true, text: translatedText }), { status: 201 });
    } catch (error: unknown) {
        console.error("Error from translate api route: ", error)
        return new Response(JSON.stringify({
            error: error instanceof Error
                ? error.message
                : 'An unknown error occurred'
        }), { status: 500 })
    }
}