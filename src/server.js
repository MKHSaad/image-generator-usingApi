// src/server.js
import express from 'express';
import axios from 'axios';
import FormData from 'form-data';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.post('/generate', async (req, res) => {
    const prompt = req.body.prompt;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt cannot be empty' });
    }

    try {
        const payload = {
            prompt: prompt,
            output_format: 'jpg'
        };

        const response = await axios.postForm(
            'https://api.stability.ai/v2beta/stable-image/generate/sd3',
            axios.toFormData(payload, new FormData()),
            {
                validateStatus: undefined,
                responseType: 'arraybuffer',
                headers: {
                    Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
                    Accept: 'image/*'
                },
            }
        );

        if (response.status === 200) {
            // Convert the image buffer to base64 for sending to client
            const base64Image = Buffer.from(response.data).toString('base64');
            res.json({ image: `data:image/jpg;base64,${base64Image}` });
        } else {
            throw new Error(`API Error: ${Buffer.from(response.data).toString()}`);
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({
            error: `An error occurred: ${error.message}`
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});