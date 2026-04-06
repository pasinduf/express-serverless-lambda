import { Router, Request, Response } from 'express';
import { AppDataSource } from '../lib/data-source';
import { Product } from '../entities/Product.entity';
import { authenticate, authorize, optionalAuthenticate } from '../middleware/auth.middleware';
import { Role } from '../entities/User.entity';

const router = Router();

// Create Product (Optional Authentication)
router.post('/', optionalAuthenticate, async (req: Request, res: Response) => {
    const productRepository = AppDataSource.getRepository(Product);
    const { name, description, price } = req.body;
    const userId = req.user?.userId;
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

    try {
        const product = productRepository.create({
            name,
            description: description || null,
            price: numericPrice || 0,
            userId: userId || null,
        });

        await productRepository.save(product);
        res.status(201).json(product);
    } catch (error: any) {
        console.error('TypeORM Create Error:', error);
        res.status(400).json({
            message: 'Error creating product',
            error: error.message || error
        });
    }
});

// Get All Products (Public)
router.get('/', async (req: Request, res: Response) => {
    const productRepository = AppDataSource.getRepository(Product);
    try {
        const products = await productRepository.find({
            relations: ['user'],
            select: {
                user: {
                    email: true
                }
            }
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
});

// Get Single Product
router.get('/:id', async (req: Request, res: Response) => {
    const productRepository = AppDataSource.getRepository(Product);
    try {
        const product = await productRepository.findOne({
            where: { id: parseInt(req.params.id as string) },
            relations: ['user'],
            select: {
                user: {
                    email: true
                }
            }
        });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error });
    }
});

// Delete Product (Admin only)
router.delete('/:id', authenticate, authorize([Role.ADMIN]), async (req: Request, res: Response) => {
    const productRepository = AppDataSource.getRepository(Product);
    try {
        const result = await productRepository.delete(parseInt(req.params.id as string));
        if (result.affected === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error });
    }
});

export default router;
