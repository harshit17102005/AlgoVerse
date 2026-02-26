import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiRoutes from './routes/ai';
import userRoutes from './routes/users';
import connectDB from './config/db';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/ai', aiRoutes);
app.use('/api/users', userRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'AlgoVerse Backend is running!' });
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});

