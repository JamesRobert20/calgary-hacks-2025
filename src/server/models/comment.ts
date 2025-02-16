import { Schema, Model } from 'mongoose';
import { CommentSchemaType } from '@/types/comment';
import { DATABASE_CONNECTION } from '@/server/database';

const CommentSchema = new Schema<CommentSchemaType>({
    post: {
        type: String,
        required: true,
        ref: "Post"
    },
    creator: {
        type: String,
        required: true,
        ref: "User"
    },
    text: {
        type: String,
        required: true
    }
}, { collection: 'Comments', timestamps: true, versionKey: false });

const CommentModel = DATABASE_CONNECTION.models.Comment as Model<CommentSchemaType> ||
    DATABASE_CONNECTION.model<CommentSchemaType>('Comment', CommentSchema);

export default CommentModel;