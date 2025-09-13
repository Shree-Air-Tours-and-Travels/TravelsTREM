// src/components/Chat/ChatWidget.jsx
import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./chat.style.scss";
import Button from "../../stories/Button";
import fetchData from "../../utils/fetchData";


export default function ChatWidget({ user = null, readonly = false, floating = false }) {
    const [open, setOpen] = useState(!floating);
    const [text, setText] = useState("");

    // Initial messages: include assistant's greeting
    const [messages, setMessages] = useState([
        { role: "system", content: "You are a helpful travel assistant." },
        { role: "assistant", content: "Hi! Ask me about tours, bookings, or destinations." }
    ]);

    const [loading, setLoading] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages, open]);

    async function sendMessage() {
        if (!text.trim() || readonly) return;
        const userMsg = { role: "user", content: text.trim() };
        const newMsgs = [...messages, userMsg];
        setMessages(newMsgs);
        setText("");
        setLoading(true);

        try {
            const result = await fetchData("/chat", {
                method: "POST",
                body: { messages: newMsgs }, // fetchData will forward as axios body
            });

            // result has: { status, message, componentData }
            if (result.status === "success") {
                const assistantContent = result.componentData?.reply?.content ?? "No reply.";
                setMessages(prev => [...prev, { role: "assistant", content: assistantContent }]);
            } else {
                // handle backend "error" replies nicely
                setMessages(prev => [...prev, { role: "assistant", content: `Error: ${result.message || "Something went wrong"}` }]);
            }
        } catch (err) {
            // fetchData returns an error-shaped object, but guard anyway
            setMessages(prev => [...prev, { role: "assistant", content: `Network error: ${err.message || "Unknown"}` }]);
        } finally {
            setLoading(false);
        }
    }

    function handleKey(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    return (
        <>
            {floating && (
                <Button
                    text={open ? "✕" : "Help"}
                    variant="solid-outline"
                    color="primary"
                    onClick={() => setOpen(prev => !prev)}
                    secondaryColor="white"
                    primaryClassName={`chat-floating-toggle ${open ? "open" : ""}`}
                />
            )}

            {/* BACKDROP: clicking it closes the overlay */}
            <div
                className={`chat-backdrop ${open ? "visible" : ""}`}
                onClick={() => setOpen(false)}
                role="button"
                aria-hidden={!open}
            />

            <div
                className={`chat-widget ${floating ? "chat-widget--floating" : "chat-widget--inline"} ${open ? "open" : "closed"}`}
                role="region"
                aria-label="Chat widget"
            >
                <div className="chat-widget__header">
                    <div className="chat-widget__title">TravelsTREM — Virtual Assistant</div>
                    <div className="chat-widget__actions">
                        <button className="chat-close-btn" onClick={() => setOpen(false)} aria-label="Close chat">✕</button>
                    </div>
                </div>

                <div className="chat-widget__messages" ref={containerRef}>
                    {messages.filter(m => m.role !== "system").map((m, i) => (
                        <div key={i} className={`chat-msg chat-msg--${m.role}`}>
                            <div className="chat-msg__content">{m.content}</div>
                        </div>
                    ))}
                    {loading && <div className="chat-msg chat-msg--assistant"><div className="chat-msg__content">Typing…</div></div>}
                </div>

                <div className="chat-widget__input">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKey}
                        placeholder="type here..."
                        disabled={readonly}
                        rows={1}
                        aria-label="Type your message"
                    />
                    <Button
                        text={loading ? "Sending..." : "Send"}
                        size="medium"
                        variant="solid"
                        color="primary"
                        isCircular={false}
                        onClick={sendMessage}
                    />
                </div>
            </div>
        </>
    );
}

ChatWidget.propTypes = {
    user: PropTypes.object,
    readonly: PropTypes.bool,
    floating: PropTypes.bool,
};