import { Schema, model, Document } from 'mongoose';

export type ControlStatus = 'PASSING' | 'FAILING' | 'UNKNOWN';

export interface IControl extends Document {
  title: string;
  description?: string;
  category: string;
  status: ControlStatus;
}

const controlSchema = new Schema<IControl>({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  status: {
    type: String,
    enum: ['PASSING', 'FAILING', 'UNKNOWN'],
    default: 'UNKNOWN',
    required: true,
  },
});

export const Control = model<IControl>('Control', controlSchema);
