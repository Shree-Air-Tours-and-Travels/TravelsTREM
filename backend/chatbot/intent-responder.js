// intent-responder.js
// Expanded intent mapping with canned responses for TravelsTREM.
// Add more intents as needed. findIntentReply(text) returns the canned reply or null.

const intents = [
    {
        id: "greeting",
        patterns: [/^hi\b/i, /^hello\b/i, /hey( there)?/i, /\bhey\b/i],
        reply:
            "Hi! 👋 I'm TravelsTREM — I can help with bookings, tours, and destinations. How can I help you today?",
    },

    {
        id: "booking_status",
        patterns: [
            /^booking status\b/i,
            /track (my )?booking/i,
            /where.*booking/i,
            /status of.*booking/i,
        ],
        reply:
            "To check booking status please share your booking ID or the email used to place the booking. Once you provide that, I’ll fetch the current status and next steps.",
    },

    {
        id: "cancel_booking",
        patterns: [
            /cancel (my )?booking/i,
            /\bi want to cancel\b/i,
            /please cancel/i,
        ],
        reply:
            "I can help cancel bookings. Please provide the booking ID. Note: cancellations are allowed within 30 minutes of booking. Once you share the booking ID, I'll confirm and proceed.",
    },

    // ---------- New detailed canned replies requested by you ----------
    {
        id: "bookings",
        patterns: [
            /\bbook(ing| a| me)?\b/i,
            /\bmake (a )?booking\b/i,
            /i want to book/i,
            /help me book/i,
        ],
        reply: `📌 Bookings!

            I'd be happy to help with bookings.

            To get started, can you please tell me:
            1. Where are you planning to travel to?
            2. What type of accommodation are you looking for (hotel, resort, hostel, etc.)?
            3. How many people will be traveling?
            4. Are there any specific dates in mind or a range of dates you're flexible with?
            5. Do you have any particular activities or experiences you'd like to book (e.g. sightseeing tours, outdoor adventures, food and wine experiences)?

            Let me know and I'll do my best to help you make a booking!`,
    },

    {
        id: "tours",
        patterns: [
            /\btour(s)?\b/i,
            /book a tour/i,
            /guided tour/i,
            /city tour/i,
            /adventure tour/i,
            /food tour/i,
        ],
        reply: `🗺️ Tours

            I'd be happy to help with tours.

            What type of tour are you interested in? Here are some options:
            1. City Tours — Explore famous cities (Paris, Rome, New York).
            2. Nature & Wildlife Tours — National parks, hiking, safaris.
            3. Cultural Tours — Food tours, museums, local experiences.
            4. Adventure Tours — Skydiving, bungee, rafting.
            5. Food & Wine Tours — Local cuisine, wineries, breweries.

            I can also help with:
            • Guided Tours — local expert guides
            • Private Tours — personalized for your group
            • Multi-Day Tours — extended itineraries

            Which type of tour are you interested in, or do you have specific activities in mind?`,
    },

    {
        id: "destination",
        patterns: [
            /\bdestination(s)?\b/i,
            /where should i travel/i,
            /suggest (a|some) (destination|place)/i,
            /where to go/i,
        ],
        reply: `🌍 Destination suggestions

        I'd be happy to help with destination suggestions!

        Quick questions to narrow it down:
        1. What type of vacation are you looking for? (beach, city, outdoor, cultural)
        2. What's your budget per person?
        3. How many days do you have?
        4. Any activities you must do? (snorkeling, hiking, food experiences)

        Popular ideas by type:
        • Beach: Bali, Maui, Santorini, Costa Rica
        • City breaks: Tokyo, New York, Paris, Rome
        • Outdoor/adventure: Iceland, New Zealand, Swiss Alps
        • Cultural: India, Morocco, Japan, Italy

        If you tell me budget and dates, I’ll give tailored suggestions and sample itineraries.`,
    },

    // optional: more common user intents
    {
        id: "pricing",
        patterns: [
            /\b(price|cost|fare|rate)s?\b/i,
            /how much does (it|this) cost/i,
            /what is the price/i,
        ],
        reply:
            "To provide pricing, please share the destination, dates, number of travelers, and preferred accommodation type. I’ll fetch options and price ranges for you.",
    },

    {
        id: "hours_support",
        patterns: [
            /\b(open|hours|support hours)\b/i,
            /customer support/i,
            /helpdesk/i,
        ],
        reply:
            "Our support team is available 9:00 AM — 9:00 PM local time. If you need immediate assistance outside these hours, please share your issue and contact info and we'll follow up as soon as possible.",
    },

    {
        id: "farewell",
        patterns: [
            /\bbye\b/i,
            /\bgoodbye\b/i,
            /\bsee you\b/i,
            /\bthanks\b/i,
            /\bthank you\b/i,
        ],
        reply:
            "Thanks for using TravelsTREM! If you need anything else later, just drop a message. Safe travels! ✈️",
    },

    {
        id: "fallback",
        patterns: [/./], // catch-all (must be last)
        reply: null, // null means allow LLM (Ollama) to handle the reply
    },
];

// Helper function to find a canned reply for a user message
export function findIntentReply(text) {
    if (!text || typeof text !== "string") return null;
    const trimmed = text.trim();
    if (!trimmed) return null;

    // Check intents in order — first match wins
    for (const it of intents) {
        for (const p of it.patterns) {
            try {
                if (p.test(trimmed)) {
                    // Return reply (could be null for fallback intent)
                    return it.reply;
                }
            } catch (e) {
                // If pattern is invalid, skip it safely
                console.warn("Invalid pattern in intent:", it.id, e);
                continue;
            }
        }
    }
    return null;
}

// Export intents for inspection / admin UIs if needed
export function listIntents() {
    return intents.map((i) => ({
        id: i.id,
        samplePatterns: i.patterns.slice(0, 3).map(String),
        hasReply: !!i.reply,
    }));
}

export default {
    findIntentReply,
    listIntents,
};
