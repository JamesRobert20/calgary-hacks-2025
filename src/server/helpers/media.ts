import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Bucket = process.env.AWS_STORAGE_BUCKET
const client = new S3Client({
    region: process.env.AWS_CONFIG_REGION
});

export async function getPresignedUrl(Key: string, ContentType: string) {
    try {
        const command = new PutObjectCommand({ Bucket: s3Bucket, Key, ContentType });
        const presignedUrl = await getSignedUrl(client, command, { expiresIn: 5 * 60 });
        return presignedUrl;
    } catch (error: unknown) {
        console.error("Error from getPresignedUrl helper: ", error)
        throw new Error(error instanceof Error ? error.message : "An unknown error occurred")
    }
}