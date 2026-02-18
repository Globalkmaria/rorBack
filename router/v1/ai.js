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
      model: config.chatgpt.model,
      instructions: `You are a concise stock analyst. When given a stock name or ticker symbol, provide a brief investment-focused analysis including:

1. **Company Overview** - What the company does in 1-2 sentences
2. **Key Financials** - Market cap, P/E ratio, revenue trend, EPS
3. **Recent Performance** - Recent price movement and any notable catalysts
4. **Strengths & Risks** - 2-3 bullet points each
5. **Analyst Sentiment** - General Wall Street consensus if known

Keep the response concise and factual. Do not give direct buy/sell recommendations. Use plain language accessible to everyday investors. If you don't have current data, clearly state your knowledge cutoff.`,
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
