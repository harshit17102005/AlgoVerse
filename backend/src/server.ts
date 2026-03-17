import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiRoutes from './routes/ai';
import userRoutes from './routes/users';
import userRoutesFirebase from './routes/user';
import connectDB from './config/db';
import mongoose from 'mongoose';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: ['https://algo-verse-ruby.vercel.app', 'http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));

app.use('/api/ai', aiRoutes);
app.use('/api/users', userRoutes);
app.use('/api/user', userRoutesFirebase);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'AlgoVerse Backend is running!' });
});

// Connect to MongoDB
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('Connected to MongoDB'))
        .catch((err) => console.error('Failed to connect to MongoDB', err));
} else {
    console.warn('MONGODB_URI is not defined in .env, user database disabled.');
}

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
