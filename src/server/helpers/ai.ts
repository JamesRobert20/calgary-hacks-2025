import { v2 } from '@google-cloud/translate';

const translate = new v2.Translate({
    key: process.env.GOOGLE_TRANSLATE_API_KEY,
});

export async function translateText(
    text: string,
    targetLanguage: string = 'en'
): Promise<string> {
    try {
        const [translation] = await translate.translate(text, targetLanguage);
        return translation;
    } catch (error) {
        console.error('Translation error:', error);
        throw new Error('Failed to translate text');
    }
}