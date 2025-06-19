// backend/src/models/Bebida.ts
import { Schema, model } from 'mongoose';
import { IBebida } from '../types';

const bebidaSchema = new Schema<IBebida>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: String, required: true, default: 'bebidas' },
  volume: { type: String }, // Campo específico
});

const Bebida = model<IBebida>('Bebida', bebidaSchema);
export default Bebida;