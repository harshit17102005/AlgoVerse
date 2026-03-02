const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyB0uKy9EnNZJiiYm7FhRzEf04P8DeEss60";
const genAI = new GoogleGenerativeAI(API_KEY);

async function checkKey() {
    try {
        console.log("Testing API Key...");
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent("Say 'API IS WORKING'");
        console.log("SUCCESS:", result.response.text());
    } catch (e) {
        console.error("FAILED:");
        console.error(e.message);
    }
}

checkKey();
