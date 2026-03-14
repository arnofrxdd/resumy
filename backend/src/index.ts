import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

import resumeRoutes from './routes/resume';
import aiRoutes from './routes/ai';
import userRoutes from './routes/user';
import resumeBuilderRoutes from './routes/resumeBuilder.routes';
import pdfRoutes from './routes/pdfRoutes';
import templateRoutes from './routes/templates';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(compression());

const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://gaplytiq.com',
    'https://www.gaplytiq.com',
    'https://arnavcloud.co.in',
    'https://www.arnavcloud.co.in'
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1 || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
            callback(null, true);
        } else {
            console.error(`[CORS Error] Origin ${origin} not allowed`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send('Resume Builder Backend Running');
});

// Minimal routes for standalone Resume Builder
app.use('/api/resumes', resumeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/user', userRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api', resumeBuilderRoutes);
app.use('/api/pdf', pdfRoutes);

app.get('/api/health', (_: Request, res: Response) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
    console.log(' Resume Builder Backend running on http://localhost:' + PORT);
});
