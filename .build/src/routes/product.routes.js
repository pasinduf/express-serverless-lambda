"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_source_1 = require("../lib/data-source");
const Product_entity_1 = require("../entities/Product.entity");
const auth_middleware_1 = require("../middleware/auth.middleware");
const User_entity_1 = require("../entities/User.entity");
const router = (0, express_1.Router)();
// Create Product (Optional Authentication)
router.post('/', auth_middleware_1.optionalAuthenticate, async (req, res) => {
    const productRepository = data_source_1.AppDataSource.getRepository(Product_entity_1.Product);
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
    }
    catch (error) {
        console.error('TypeORM Create Error:', error);
        res.status(400).json({
            message: 'Error creating product',
            error: error.message || error
        });
    }
});
// Get All Products (Public)
router.get('/', async (req, res) => {
    const productRepository = data_source_1.AppDataSource.getRepository(Product_entity_1.Product);
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
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
});
// Get Single Product
router.get('/:id', async (req, res) => {
    const productRepository = data_source_1.AppDataSource.getRepository(Product_entity_1.Product);
    try {
        const product = await productRepository.findOne({
            where: { id: parseInt(req.params.id) },
            relations: ['user'],
            select: {
                user: {
                    email: true
                }
            }
        });
        if (!product)
            return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching product', error });
    }
});
// Delete Product (Admin only)
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)([User_entity_1.Role.ADMIN]), async (req, res) => {
    const productRepository = data_source_1.AppDataSource.getRepository(Product_entity_1.Product);
    try {
        const result = await productRepository.delete(parseInt(req.params.id));
        if (result.affected === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting product', error });
    }
});
exports.default = router;
//# sourceMappingURL=product.routes.js.map