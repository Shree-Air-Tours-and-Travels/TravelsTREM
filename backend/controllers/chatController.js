// controllers/chatController.js
import fetch from "node-fetch"; // remove if Node >=18 with global fetch

export async function handleChat(req, res) {
    try {
        const { messages } = req.body;

        if (!Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({
                status: "error",
                message: "Missing messages array",
                componentData: {}
            });
        }

        const OPENAI_KEY = process.env.OPENAI_API_KEY;

        // If no API key configured, skip provider call
        if (!OPENAI_KEY) {
            const lastMsg = messages[messages.length - 1]?.content ?? "";
            return res.json({
                status: "success",
                message: "Dummy mode (no API key)",
                componentData: {
                    reply: {
                        content: `You said: "${lastMsg}". (Dummy response — no real AI right now.)`
                    }
                }
            });
        }

        // Build OpenAI request
        const payload = {
            model: "gpt-4o-mini", // update to model you have access to
            messages,
            max_tokens: 700,
            temperature: 0.2
        };

        const resp = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENAI_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const text = await resp.text();

        // If provider error, fallback to dummy response
        if (!resp.ok) {
            console.error("OpenAI error:", text);

            const lastMsg = messages[messages.length - 1]?.content ?? "";
            return res.json({
                status: "success",
                message: "Fallback dummy reply (provider error)",
                componentData: {
                    reply: {
                        content: `You said: "${lastMsg}". (Dummy fallback because AI quota was exceeded.)`
                    }
                }
            });
        }

        // Parse response
        const data = JSON.parse(text);
        const assistantContent =
            data?.choices?.[0]?.message?.content ??
            data?.choices?.[0]?.text ??
            null;

        if (!assistantContent) {
            const lastMsg = messages[messages.length - 1]?.content ?? "";
            return res.json({
                status: "success",
                message: "Fallback dummy (no assistant reply)",
                componentData: {
                    reply: {
                        content: `You said: "${lastMsg}". (Dummy fallback — provider returned no content.)`
                    }
                }
            });
        }

        // Success case
        return res.json({
            status: "success",
            message: "OK",
            componentData: {
                reply: { content: assistantContent }
            }
        });
    } catch (err) {
        console.error("chatController error:", err);

        const lastMsg = req.body?.messages?.slice(-1)[0]?.content ?? "";
        return res.json({
            status: "success",
            message: "Fallback dummy (server error)",
            componentData: {
                reply: {
                    content: `You said: "${lastMsg}". (Dummy fallback — server error.)`
                }
            }
        });
    }
}
