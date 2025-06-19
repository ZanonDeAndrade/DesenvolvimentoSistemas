// backend/src/index.ts
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/login';
import registerRoutes from './routes/register';
import productRoutes from './routes/products';

dotenv.config();

console.log('--- URI DE CONEXÃO DO MONGODB QUE O BACKEND ESTÁ USANDO:');
console.log(process.env.MONGO_URI);
console.log('----------------------------------------------------');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API de Autenticação e Produtos em Funcionamento!');
});

app.use('/auth', authRoutes);
app.use('/auth', registerRoutes);
app.use('/products', productRoutes); // Rotas de produtos sob o prefixo /products

mongoose.connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('🟢 Conectado ao MongoDB');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar no MongoDB:', error);
  });