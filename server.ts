import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createVerifiedTransporter } from './server/mailer';
import {
  fetchBookedSlotsResult,
  processBookingSubmission,
} from './server/bookingService';
import { processContactSubmission } from './server/contactService';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// 1. API Route: Fetch booked time slots
app.get('/api/booked-slots', async (_req, res) => {
  const result = await fetchBookedSlotsResult();
  res.setHeader('Cache-Control', 'no-store');
  return res.status(result.status).json(result.body);
});

// 2. API Route: Book Discovery Call
app.post('/api/book-call', async (req, res) => {
  const result = await processBookingSubmission(req.body);
  return res.status(result.status).json(result.body);
});

// 3. API Route: Contact Form
app.post('/api/contact', async (req, res) => {
  const result = await processContactSubmission(req.body);
  return res.status(result.status).json(result.body);
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', async () => {
    console.log(`Server listening at http://0.0.0.0:${PORT}`);
    try {
      const { mode, config } = await createVerifiedTransporter('startup');
      console.log('[MAIL STARTUP CHECK]', {
        transportMode: mode,
        envLoaded: config.envStatus,
        missingVariables: config.missingVariables,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[MAIL STARTUP CHECK FAILED]', msg);
    }
  });
}

startServer();
