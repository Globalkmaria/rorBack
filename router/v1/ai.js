import express from "express";
import OpenAI from "openai";
import { config } from "../../config/index.js";

const router = express.Router();

const openai = new OpenAI({
  apiKey: config.chatgpt.apiKey,
});

router.post("/stock-info", async (req, res, next) => {
  try {
    const { stockName } = req.body;

    if (!stockName) {
      return res.status(400).send("Missing stock name");
    }

    const response = await openai.responses.create({
      prompt: {
        id: config.chatgpt.promptId,
        version: config.chatgpt.version,
      },
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: stockName,
            },
          ],
        },
      ],
      reasoning: {},
      max_output_tokens: config.chatgpt.maxTokens,
      store: true,
    });

    const text = response.output_text;

    return res.send({ text });
  } catch (error) {
    next(error);
  }
});

export default router;
