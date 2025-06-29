import express from "express";
import OpenAI from "openai";
import { config } from "../../config/index.js";
import { checkUserCookieOrSet } from "../../middleware/userCookie.js";
import { aiLimitCheckAndUpdateLimit } from "../../db/aiRateLimiterStore.js";

const router = express.Router();

const openai = new OpenAI({
  apiKey: config.chatgpt.apiKey,
});

router.post("/stock-info", checkUserCookieOrSet, async (req, res, next) => {
  try {
    const { stockName } = req.body;

    if (!stockName) {
      return res.status(400).send("Missing stock name");
    }

    const anonId = res.anonId;

    if (!anonId) {
      return res.status(401).send("Unauthorized");
    }

    if (!aiLimitCheckAndUpdateLimit(anonId)) {
      return res.status(429).send("Too Many Requests");
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
