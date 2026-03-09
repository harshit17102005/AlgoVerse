import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
    try {
        const res = await fetch("https://api.groq.com/openai/v1/models", {
            headers: { "Authorization": `Bearer ${process.env.GROK_API_KEY}` }
        });
        const data = await res.json();
        fs.writeFileSync("models_out.json", JSON.stringify(data, null, 2));
    } catch (e: any) {
        fs.writeFileSync("models_out.json", JSON.stringify({ error: e.message }));
    }
}
check();
