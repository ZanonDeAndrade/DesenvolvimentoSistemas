// backend/src/models/Combo.ts
import { Schema, model } from 'mongoose';
import { ICombo } from '../types';

const comboSchema = new Schema<ICombo>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  image: { type: String },
  category: { type: String, required: true, default: 'combos' },
  details: [{ type: String }],
});

const Combo = model<ICombo>('Combo', comboSchema);
export default Combo;