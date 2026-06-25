import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
    title: string;
    description: string;
    status: 'Active' | 'Completed' | 'Archived';
    user: mongoose.Types.ObjectId;
}

const projectSchema = new Schema<IProject>(
    {
        title: {
            type: String,
            required: true
        },
        description: { 
            type: String, 
            required: true 
        },
        status: {
            type: String,
            enum: ['Active', 'Completed', 'Archived'],
            default: 'Active'
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    { timestamps: true }
);

export default mongoose.model<IProject>('Project', projectSchema);