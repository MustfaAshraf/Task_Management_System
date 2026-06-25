import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
    title: string;
    description: string;
    status: 'Pending' | 'In Progress' | 'Done';
    priority: 'Low' | 'Medium' | 'High';
    dueDate: Date;
    project: mongoose.Types.ObjectId;
}

const taskSchema = new Schema<ITask>(
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
            enum: ['Pending', 'In Progress', 'Done'],
            default: 'Pending'
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            default: 'Medium'
        },
        dueDate: { 
            type: Date, 
            required: true 
        },
        project: {
            type: Schema.Types.ObjectId,
            ref: 'Project',
            required: true
        }
    },
    { timestamps: true }
);

export default mongoose.model<ITask>('Task', taskSchema);