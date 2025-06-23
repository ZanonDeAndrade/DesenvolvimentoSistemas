import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  telefone: { type: String, required: true },

  endereco: {
    type: { 
      rua: { type: String, required: true },
      numero: { type: String, required: true },
      complemento: { type: String, required: false }, 
      bairro: { type: String, required: true },
      cidade: { type: String, required: true },
      estado: { type: String, required: true },
      cep: { type: String, required: true },
    },
    required: false
  },
});

export const User = mongoose.model('User', userSchema);
