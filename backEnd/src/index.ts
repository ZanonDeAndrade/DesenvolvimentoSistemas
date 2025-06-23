// backend/src/index.ts
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path'; // <--- IMPORTE O MÓDULO PATH
import authRoutes from './routes/login';
import registerRoutes from './routes/register';
import productRoutes from './routes/products';
import adressRoutes from './routes/adress'; // Importa as rotas de endereço

dotenv.config();

console.log('--- URI DE CONEXÃO DO MONGODB QUE O BACKEND ESTÁ USANDO:');
console.log(process.env.MONGO_URI);
console.log('----------------------------------------------------');

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

// --- ADICIONE ESTAS DUAS LINHAS PARA SERVIR OS ASSETS ESTÁTICOS DO BACKEND ---
// Cria um caminho absoluto para a pasta 'assets' dentro de 'src'
const assetsPath = path.join(__dirname, 'assets');
console.log(`Servindo assets estáticos de: ${assetsPath}`); // Para debug
// Configura o Express para servir arquivos estáticos de 'assetsPath' sob o prefixo '/backend-assets'
app.use('/backend-assets', express.static(assetsPath, {
  maxAge: '1y'  // Define o cache para 1 ano, você pode ajustar conforme necessário
}));
// -------------------------------------------------------------------------


app.use('/auth', authRoutes);
app.use('/auth', registerRoutes);
app.use('/products', productRoutes);
app.use('/', adressRoutes); // Rotas de produtos sob o prefixo /products

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