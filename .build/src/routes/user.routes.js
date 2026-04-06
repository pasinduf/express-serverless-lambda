"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_source_1 = require("../lib/data-source");
const User_entity_1 = require("../entities/User.entity");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
// Register
router.post('/register', async (req, res) => {
    const userRepository = data_source_1.AppDataSource.getRepository(User_entity_1.User);
    const { email, password, role } = req.body;
    try {
        const existingUser = await userRepository.findOneBy({ email });
        if (existingUser)
            return res.status(400).json({ message: 'User already exists' });
        const user = userRepository.create({
            email,
            password, // Note: In production, hash this password!
            role,
        });
        await userRepository.save(user);
        res.status(201).json({ message: 'User created successfully', userId: user.id });
    }
    catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});
// Login
router.post('/login', async (req, res) => {
    const userRepository = data_source_1.AppDataSource.getRepository(User_entity_1.User);
    const { email, password } = req.body;
    try {
        const user = await userRepository.findOneBy({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
        res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    }
    catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});
exports.default = router;
//# sourceMappingURL=user.routes.js.map