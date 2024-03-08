const express = require('express')
const app = express();
const dotenv = require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({extended: true}))

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const MODEL_NAME = "gemini-1.0-pro";
  const API_KEY = process.env.API_KEY;
  
  async function runChat() {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
    };

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ];

    app.post('/chathere', async (req, res) => {
        const { name, wantToWrite, writeTo, company, hiringFor, expYears, expMonths, expAs, expType, others, jd } = req.body;
        const prompt = `I am ${name} and I want to write a ${wantToWrite} to ${writeTo} of the ${company} as they are hiring for ${hiringFor} and I have ${expYears} Years and ${expMonths} Months of Experience as a ${expAs} ${expType} and other qualifications are ${others} and this is the Job Description: ${jd}`;
        const chat = model.startChat({
            generationConfig,
            safetySettings,
            history: [
                {
                    role: "user",
                    parts: [{ text: prompt }],
                },
                {
                    role: "model",
                    parts: [{ text: "" }],
                },
            ],
        });

        const result = await chat.sendMessage("YOUR_USER_INPUT");
        const response = result.response;
        res.json({ response: response.text() });
    });
}

runChat();

  app.listen(process.env.PORT,()=>{
    console.log(`server started at the port ${process.env.PORT}`)
})