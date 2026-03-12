import { Schema, model, type Document } from 'mongoose';

export interface IOwner extends Document {
  name: string;
  email: string;
}

const ownerSchema = new Schema<IOwner>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

export const Owner = model<IOwner>('Owner', ownerSchema);
