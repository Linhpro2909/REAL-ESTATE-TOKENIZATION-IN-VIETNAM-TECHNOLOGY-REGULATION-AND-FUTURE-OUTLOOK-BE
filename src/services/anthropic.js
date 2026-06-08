const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/**
 * Call Claude API with a system prompt and user messages.
 * @param {string} systemPrompt
 * @param {Array<{role:string, content:string}>} messages
 * @param {number} maxTokens
 * @returns {Promise<string>}
 */
async function callClaude(systemPrompt, messages, maxTokens = 1500) {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: maxTokens,
    system: systemPrompt,
    messages,
  });
  return response.content[0]?.text ?? "No response generated.";
}

module.exports = { callClaude };
 