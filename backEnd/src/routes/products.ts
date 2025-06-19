// backend/src/routes/products.ts
import { Router } from 'express';
import Combo from '../modules/Combo';
import Bebida from '../modules/Bebida';
import SushiItem from '../modules/SushiItem';
import { sushiItems as initialSushiItems } from '../data';
import { SushiItemData } from '../types';

const router = Router();

// Rota para popular o banco de dados com os produtos
router.post('/populate', async (req, res) => {
    try {
        // Limpa as coleções antes de inserir para evitar duplicatas em cada populada
        await Combo.deleteMany({});
        await Bebida.deleteMany({});
        await SushiItem.deleteMany({});
        console.log('Coleções de produtos limpas.');

        let insertedCount = 0;
        for (const item of initialSushiItems as SushiItemData[]) {
            switch (item.category) {
                case 'combos':
                    await Combo.create(item);
                    break;
                case 'bebidas':
                    // Adiciona o campo 'volume' se a descrição contiver "ml" ou "l"
                    const volumeMatch = item.description?.match(/(\d+\s*(?:ml|l))/i);
                    const volume = volumeMatch ? volumeMatch[0] : undefined;
                    await Bebida.create({ ...item, volume });
                    break;
                case 'sashimi':
                case 'uramaki':
                case 'hot':
                case 'temaki':
                    await SushiItem.create(item);
                    break;
                default:
                    console.warn(`Categoria desconhecida para o item: ${item.name}`);
            }
            insertedCount++;
        }

        res.status(200).json({ message: `${insertedCount} itens inseridos nas respectivas coleções!` });
    } catch (error: any) {
        console.error('Erro ao popular o banco de dados de produtos:', error);
        res.status(500).json({ message: 'Erro ao popular o banco de dados de produtos', error: error.message });
    }
});

// Rotas para buscar produtos por categoria
router.get('/combos', async (req, res) => {
    try {
        const combos = await Combo.find({});
        res.status(200).json(combos);
    } catch (error: any) {
        res.status(500).json({ message: 'Erro ao buscar combos', error: error.message });
    }
});

router.get('/bebidas', async (req, res) => {
    try {
        const bebidas = await Bebida.find({});
        res.status(200).json(bebidas);
    } catch (error: any) {
        res.status(500).json({ message: 'Erro ao buscar bebidas', error: error.message });
    }
});

router.get('/sushi-items', async (req, res) => {
    try {
        const sushiItems = await SushiItem.find({});
        res.status(200).json(sushiItems);
    } catch (error: any) {
        res.status(500).json({ message: 'Erro ao buscar itens de sushi', error: error.message });
    }
});

// Rota para buscar todos os produtos de todas as categorias
router.get('/', async (req, res) => {
  try {
    const combos = await Combo.find({});
    const bebidas = await Bebida.find({});
    const sushiItems = await SushiItem.find({}); // Isso inclui sashimi, uramaki, hot, temaki

    const allProducts = [...combos, ...bebidas, ...sushiItems];
    res.status(200).json(allProducts);
  } catch (error: any) {
    console.error('Erro ao buscar todos os produtos:', error);
    res.status(500).json({ message: 'Erro ao buscar todos os produtos', error: error.message });
  }
});


// Exemplo: Rota para adicionar um novo item de sushi (POST)
// O corpo da requisição deve corresponder à interface ISushiItem
router.post('/sushi-item', async (req, res) => {
    try {
        const newItem = await SushiItem.create(req.body);
        res.status(201).json(newItem);
    } catch (error: any) {
        res.status(400).json({ message: 'Erro ao criar item de sushi', error: error.message });
    }
});

// Exemplo: Rota para adicionar uma nova bebida (POST)
// O corpo da requisição deve corresponder à interface IBebida
router.post('/bebida', async (req, res) => {
  try {
      const newBebida = await Bebida.create(req.body);
      res.status(201).json(newBebida);
  } catch (error: any) {
      res.status(400).json({ message: 'Erro ao criar bebida', error: error.message });
  }
});



export default router;