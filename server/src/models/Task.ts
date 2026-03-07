import { Schema, model, Document, Types } from 'mongoose';

export interface ITask extends Document {
  control: Types.ObjectId;
  owner: Types.ObjectId;
  dueDate: Date;
  notes?: string;
  completed: boolean;
}

const taskSchema = new Schema<ITask>({
  control: { type: Schema.Types.ObjectId, ref: 'Control', required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'Owner', required: true },
  dueDate: { type: Date, required: true },
  notes: { type: String },
  completed: { type: Boolean, default: false, required: true },
});

export const Task = model<ITask>('Task', taskSchema);
