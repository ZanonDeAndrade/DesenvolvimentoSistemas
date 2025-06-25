// backend/src/index.ts
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/login';
import registerRoutes from './routes/register';
import productRoutes from './routes/products';
import adressRoutes from './routes/adress';
import paymentRoutes from './routes/payment'; 
import ordersRoutes from './routes/orders'; 

dotenv.config();

console.log('--- URI DE CONEXÃO DO MONGODB QUE O BACKEND ESTÁ USANDO:');
console.log(process.env.MONGO_URI);
console.log('----------------------------------------------------');

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

const assetsPath = path.join(__dirname, 'assets');
console.log(`Servindo assets estáticos de: ${assetsPath}`);
app.use('/backend-assets', express.static(assetsPath, {
  maxAge: '1y'
}));

app.use('/auth', authRoutes);
app.use('/auth', registerRoutes);
app.use('/products', productRoutes);
app.use('/', adressRoutes);
app.use('/payment', paymentRoutes); 
app.use('/orders', ordersRoutes); 

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