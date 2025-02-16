import { Schema, Model } from 'mongoose';
import { PostSchemaType } from '@/types/post';
import { mediaTypes } from '@/server/helpers';
import { DATABASE_CONNECTION } from '@/server/database';

const PostSchema = new Schema<PostSchemaType>({
    caption: {
        type: String,
        required: false
    },
    media: {
        type: [{
            path: {
                type: String,
                required: true
            },
            type: {
                type: String,
                required: true,
                enum: mediaTypes
            }
        }],
        required: false
    },
    creator: {
        type: String,
        required: true,
        ref: "User"
    },
    tags: {
        type: [{
            type: String,
            required: true
        }],
        required: true
    }
}, { collection: 'Posts', timestamps: true, versionKey: false });

const PostModel = DATABASE_CONNECTION.models.Post as Model<PostSchemaType> ||
    DATABASE_CONNECTION.model<PostSchemaType>('Post', PostSchema);

export default PostModel;