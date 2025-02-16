import mongoose from "mongoose";

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
}

export const DATABASE_CONNECTION = mongoose.createConnection(process.env.DATABASE_URL, {
    bufferCommands: false,
    maxConnecting: 10
});

export async function connectToDatabase() {
    if (DATABASE_CONNECTION.readyState === 1) {
        return;
    }
    return await DATABASE_CONNECTION.asPromise();
}