// backend/src/models/SushiItem.ts
import { Schema, model } from 'mongoose';
import { ISushiItem } from '../types';

const sushiItemSchema = new Schema<ISushiItem>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: String, required: true },
  details: [{ type: String }],
});

const SushiItem = model<ISushiItem>('SushiItem', sushiItemSchema);
export default SushiItem;