import { Router, Request, Response } from 'express';
import { AppDataSource } from '../lib/data-source';
import { User } from '../entities/User.entity';
import jwt from 'jsonwebtoken';

const router = Router();

// Register
router.post('/register', async (req: Request, res: Response) => {
    const userRepository = AppDataSource.getRepository(User);
    const { email, password, role } = req.body;

    try {
        const existingUser = await userRepository.findOneBy({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const user = userRepository.create({
            email,
            password, // Note: In production, hash this password!
            role,
        });

        await userRepository.save(user);
        res.status(201).json({ message: 'User created successfully', userId: user.id });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
    const userRepository = AppDataSource.getRepository(User);
    const { email, password } = req.body;

    try {
        const user = await userRepository.findOneBy({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '24h' }
        );

        res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

export default router;
