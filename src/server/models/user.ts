import { Schema, Model } from 'mongoose';
import { DATABASE_CONNECTION } from '@/server/database';
import { FullUserSchema } from '@/types/user';

const userSchema = new Schema<FullUserSchema>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    clerkId: {
        type: String,
        required: true,
        unique: true
    },
    pushTokens: {
        type: [String],
        required: true,
        default: []
    }
}, { collection: "Users", timestamps: true, versionKey: false });

const User = DATABASE_CONNECTION.models.User as Model<FullUserSchema>
    || DATABASE_CONNECTION.model<FullUserSchema>("User", userSchema);

export default User;