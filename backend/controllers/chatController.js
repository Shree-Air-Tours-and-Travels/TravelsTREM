// controllers/chatController.js
//
// Robust Ollama-compatible chat controller for your TravelsTREM backend.
// - Tries /api/chat first (message-array style).
// - If /api/chat returns 404 (or model-not-found), falls back to /api/generate (prompt style).
// - Extracts assistant text from many common response shapes (including Ollama's `message.content`).
// - Logs helpful debug info (status + full response body) so you can inspect server responses.
// - Configure with env variables:
//    OLLAMA_BASE_URL (default: http://127.0.0.1:11434)
//    OLLAMA_MODEL    (default: llama3.2)
//
// Notes:
// - If you're running Node >= 18 you may remove the "node-fetch" import and use global fetch.
// - Restart your Node server after updating this file.

import fetch from "node-fetch";
import { findIntentReply } from "../chatbot/intent-responder.js";
import { messagesToPrompt, extractAssistantContentFromChat, extractAssistantContentFromGenerate } from "../chatbot/extract-responses.js";


const DEFAULT_BASE = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";
const CHAT_PATH = "/api/chat";
const GENERATE_PATH = "/api/generate";
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || "llama3.2";

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

        // Last user message (for intent detection)
        const lastMsg = messages[messages.length - 1]?.content ?? "";

        // --------------- INTENT/CANNED CHECK (early exit) ---------------
        try {
            const canned = findIntentReply(lastMsg);
            console.log("[INTENT] lastMsg:", JSON.stringify(lastMsg).slice(0, 300), "cannedPresent:", !!canned);
            if (canned) {
                // Return canned reply immediately (no LLM call)
                return res.json({
                    status: "success",
                    message: "OK (canned reply)",
                    componentData: {
                        reply: { content: canned },
                        meta: { source: "canned" }
                    }
                });
            }
        } catch (intentErr) {
            // If intent responder fails for any reason, log and continue to LLM fallback
            console.error("[INTENT] error:", intentErr);
        }
        // ----------------------------------------------------------------

        const base = process.env.OLLAMA_BASE_URL || DEFAULT_BASE;
        const model = process.env.OLLAMA_MODEL || DEFAULT_MODEL;

        // Attempt /api/chat first
        const chatUrl = `${base}${CHAT_PATH}`;
        const chatPayload = { model, messages, stream: false };

        let resp = await fetch(chatUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(chatPayload),
        });

        // If /api/chat returns 404, fallback to /api/generate
        if (resp.status === 404) {
            console.warn(`[OLLAMA] /api/chat returned 404. Falling back to /api/generate (model: ${model})`);
            const genUrl = `${base}${GENERATE_PATH}`;
            const prompt = messagesToPrompt(messages);
            resp = await fetch(genUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ model, prompt })
            });

            if (!resp.ok) {
                const text = await resp.text();
                console.error("[OLLAMA] /api/generate error:", resp.status, text);
                const last = messages[messages.length - 1]?.content ?? "";
                return res.json({
                    status: "success",
                    message: "Fallback (generate error)",
                    componentData: { reply: { content: `You said: "${last}". (Generate error: ${resp.status})` } }
                });
            }

            const data = await resp.json();
            console.log("[OLLAMA] generate response (full):", JSON.stringify(data));
            const assistantContent = extractAssistantContentFromGenerate(data);

            if (!assistantContent) {
                const last = messages[messages.length - 1]?.content ?? "";
                return res.json({
                    status: "success",
                    message: "Fallback (no generate reply)",
                    componentData: { reply: { content: `You said: "${last}". (No reply from generate.)` } }
                });
            }

            return res.json({
                status: "success",
                message: "OK",
                componentData: { reply: { content: assistantContent } }
            });
        }

        // /api/chat responded. Read text
        const respText = await resp.text();

        if (!resp.ok) {
            // Log for debugging and return friendly fallback
            console.error("[OLLAMA] /api/chat returned error status:", resp.status, respText);
            const last = messages[messages.length - 1]?.content ?? "";
            if (/model .* not found/i.test(respText)) {
                return res.json({
                    status: "success",
                    message: "Fallback (model not found)",
                    componentData: { reply: { content: `You said: "${last}". (Model not found on Ollama — pull the model or set OLLAMA_MODEL.)` } }
                });
            }
            return res.json({
                status: "success",
                message: "Fallback (chat error)",
                componentData: { reply: { content: `You said: "${last}". (Chat error: ${resp.status})` } }
            });
        }

        // Parse JSON safely
        let data;
        try {
            data = JSON.parse(respText);
        } catch (e) {
            console.error("[OLLAMA] Failed to parse JSON from /api/chat response:", e, "raw:", respText);
            const last = messages[messages.length - 1]?.content ?? "";
            return res.json({
                status: "success",
                message: "Fallback (invalid JSON from chat)",
                componentData: { reply: { content: `You said: "${last}". (Invalid JSON from chat.)` } }
            });
        }

        // Log full response for debugging
        console.log("[OLLAMA] chat response (full):", JSON.stringify(data));

        const assistantContent = extractAssistantContentFromChat(data);

        if (!assistantContent) {
            const last = messages[messages.length - 1]?.content ?? "";
            return res.json({
                status: "success",
                message: "Fallback (no chat reply)",
                componentData: { reply: { content: `You said: "${last}". (No reply from chat.)` } }
            });
        }

        // Success — return assistant content
        return res.json({
            status: "success",
            message: "OK",
            componentData: { reply: { content: assistantContent } }
        });
    } catch (err) {
        console.error("chatController unexpected error:", err);
        const lastMsg = req.body?.messages?.slice(-1)[0]?.content ?? "";
        return res.json({
            status: "success",
            message: "Fallback (server error)",
            componentData: { reply: { content: `You said: "${lastMsg}". (Server error.)` } }
        });
    }
}