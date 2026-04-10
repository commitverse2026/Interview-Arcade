// data/riddles.js
// Each riddle uses emoji/ASCII art as visual hints (no external images needed!)

const riddlesCollection = [
    {
        visual: "🕷️🕸️     🕷️🕸️",
        answer: "web crawling",
        hint: "Think about how search engines discover websites... spiders crawl the web!",
        difficulty: "easy"
    },
    {
        visual: "☁️☁️☁️\n💻━━☁️",
        answer: "cloud computing",
        hint: "Computing resources delivered over the internet, stored in the sky",
        difficulty: "easy"
    },
    {
        visual: "📦📦📦\n🚢━━━━━━━",
        answer: "docker",
        hint: "Shipping containers for code - containerization platform",
        difficulty: "easy"
    },
    {
        
    },
    {
        visual: "🐛🔍💻\n🔎_______",
        answer: "debugging",
        hint: "Fixing issues in your code - removing insects from your program",
        difficulty: "easy"
    },
    {
        visual: "🌉💻━━💻",
        answer: "api",
        hint: "Bridge between different software applications - Application Programming Interface",
        difficulty: "medium"
    },
    {
        visual: "🐿️🌰🌰🌰\n   💾",
        answer: "cache",
        hint: "Temporary storage for faster access - like a squirrel storing nuts",
        difficulty: "medium"
    },
    {
        visual: "🔥🧱━━━━━",
        answer: "firewall",
        hint: "Security barrier for your network - wall of fire protecting your data",
        difficulty: "hard"
    },
    {
        visual: "🔐➡️🤫➡️📜",
        answer: "encryption",
        hint: "Converting data into secret code - locking your information",
        difficulty: "hard"
    },
    {
        visual: "⚖️💻💻💻\n   │   │   │",
        answer: "load balancing",
        hint: "Distributing traffic across servers - balancing the weight",
        difficulty: "hard"
    },
    {
        visual: "💾📦🔙\n   ⏰",
        answer: "backup",
        hint: "Copying data for recovery - keeping a spare copy",
        difficulty: "easy"
    },
    {
        visual: "🌐🔗🌐",
        answer: "internet",
        hint: "Global network connecting computers worldwide",
        difficulty: "easy"
    },
    {
        visual: "🤖💬🤖",
        answer: "chatbot",
        hint: "AI program that simulates human conversation",
        difficulty: "medium"
    },
    {
        visual: "📱➡️☁️➡️💻",
        answer: "sync",
        hint: "Keeping data consistent across multiple devices",
        difficulty: "medium"
    }
];

// Export for use in game
if (typeof window !== "undefined") {
    window.riddlesCollection = riddlesCollection;
}