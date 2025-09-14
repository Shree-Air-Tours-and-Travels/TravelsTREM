export function messagesToPrompt(messages) {
    // Convert messages array to a single prompt for /api/generate fallback.
    // Keep system and roles clear so the model has context.
    return messages.map(m => {
        const role = (m.role || "user").toUpperCase();
        return `${role}: ${m.content}`;
    }).join("\n\n");
}

export function extractAssistantContentFromChat(data) {
    // Try many common response shapes (Ollama, OpenAI-like, other wrappers).
    if (!data) return null;

    // 1) Ollama chat shape: { message: { role:"assistant", content: "..." } }
    if (typeof data?.message?.content === "string" && data.message.content.trim()) {
        return data.message.content.trim();
    }

    // 2) OpenAI-like chat: { choices: [ { message: { content: "..." } } ] }
    const openaiMsg = data?.choices?.[0]?.message?.content ?? data?.choices?.[0]?.text;
    if (typeof openaiMsg === "string" && openaiMsg.trim()) return openaiMsg.trim();

    // 3) Simple top-level fields
    if (typeof data?.output === "string" && data.output.trim()) return data.output.trim();
    if (typeof data?.text === "string" && data.text.trim()) return data.text.trim();
    if (typeof data?.response === "string" && data.response.trim()) return data.response.trim();
    if (typeof data?.generated_text === "string" && data.generated_text.trim()) return data.generated_text.trim();

    // 4) arrays: outputs, results
    if (Array.isArray(data?.outputs) && data.outputs.length) {
        for (const o of data.outputs) {
            if (typeof o === "string" && o.trim()) return o.trim();
            if (typeof o?.content === "string" && o.content.trim()) return o.content.trim();
            if (typeof o?.text === "string" && o.text.trim()) return o.text.trim();
        }
    }

    if (Array.isArray(data?.results) && data.results.length) {
        const parts = [];
        for (const r of data.results) {
            if (typeof r === "string" && r.trim()) parts.push(r.trim());
            if (typeof r?.content === "string" && r.content.trim()) parts.push(r.content.trim());
            if (typeof r?.text === "string" && r.text.trim()) parts.push(r.text.trim());
            if (typeof r?.output === "string" && r.output.trim()) parts.push(r.output.trim());
            if (typeof r?.message?.content === "string" && r.message.content.trim()) parts.push(r.message.content.trim());
        }
        if (parts.length) return parts.join("\n\n");
    }

    // 5) choices array with chunks (delta / streaming style)
    if (Array.isArray(data?.choices) && data.choices.length) {
        const joined = data.choices.map(c => {
            if (typeof c?.text === "string") return c.text;
            if (typeof c?.message?.content === "string") return c.message.content;
            if (typeof c?.delta?.content === "string") return c.delta.content;
            return "";
        }).filter(Boolean).join("");
        if (joined.trim()) return joined.trim();
    }

    // 6) last-resort fields
    const candidateKeys = ["result", "completion"];
    for (const k of candidateKeys) {
        if (typeof data[k] === "string" && data[k].trim()) return data[k].trim();
    }

    return null;
}

export function extractAssistantContentFromGenerate(data) {
    // Generate endpoint shapes are similar; reuse the chat extractor, but prefer top-level `output`/`text`.
    if (!data) return null;
    if (typeof data?.output === "string" && data.output.trim()) return data.output.trim();
    if (typeof data?.text === "string" && data.text.trim()) return data.text.trim();
    return extractAssistantContentFromChat(data);
}
