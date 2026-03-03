import express, { Request, Response } from 'express';
import User from '../models/User';
import generateToken from '../utils/generateToken';

const router = express.Router();

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
router.post('/login', async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        // @ts-ignore
        if (user && (await user.matchPassword(password))) {
            generateToken(res, user._id.toString());

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error during login' });
    }
});

// @desc    Register a new user
// @route   POST /api/users/signup
// @access  Public
router.post('/signup', async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            generateToken(res, user._id.toString());
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error: any) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error during signup', error: error.message, stack: error.stack });
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Public (should ideally be protected, but keeping it simple based on current setup)
router.put('/profile', async (req: Request, res: Response): Promise<any> => {
    try {
        const { _id, name } = req.body;

        const user = await User.findById(_id);

        if (user) {
            user.name = name || user.name;
            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error: any) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error during profile update', error: error.message });
    }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
router.post('/logout', (req: Request, res: Response) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
});

export default router;
