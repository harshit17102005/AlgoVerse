import dotenv from 'dotenv';
dotenv.config();

async function getModels() {
    const res = await fetch("https://api.xai.com/v1/models", {
        headers: {
            "Authorization": `Bearer ${process.env.GROK_API_KEY}`
        }
    });
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
}

getModels();
