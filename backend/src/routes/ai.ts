import { Router, Request, Response } from 'express';
import { generateDSASteps } from '../services/groqService';

const router = Router();

router.post('/generate', async (req: Request, res: Response) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const result = await generateDSASteps(prompt);

        res.json(result);
    } catch (error: any) {
        if (error?.message && error.message.includes('429 Too Many Requests') || error?.message?.includes('quota')) {
            console.warn('Rate Limit Hit:', error.message);
            return res.status(429).json({
                error: 'Rate Limit Exceeded',
                details: 'Google Free Tier Quota Reached! Please wait exactly 60 seconds before generating another visualization.'
            });
        }

        console.error('Error generating DSA steps:', error);
        res.status(500).json({
            error: 'Failed to generate explanation',
            details: error.message
        });
    }
});

export default router;
