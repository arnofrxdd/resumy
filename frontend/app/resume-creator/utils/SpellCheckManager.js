/**
 * LanguageTool Integration
 * Replaces the naive local dictionary with a professional grammar and spell check API.
 * 
 * Features:
 * - Context-aware checking (won't flag "Arnav" as an error).
 * - Real suggestions (no more "anal" for "Arnav").
 * - Handles grammar and style.
 * - Caching to respect API rate limits.
 */

class SpellCheckManager {
    constructor() {
        this.ignoredWords = new Set();
        this.cache = new Map();
        this.isLoaded = true; // No longer need to fetch a huge local file

        // Words we always ignore (client-side bypass)
        this.whitelist = new Set([
            'resumy', 'resumy.io', 'zety', 'linkedin', 'github', 'api', 'ci/cd',
            'fullstack', 'frontend', 'backend', 'typescript', 'microservices'
        ]);
    }

    // Legacy method for compatibility - now returns empty or cached results
    loadDictionary() {
        return Promise.resolve();
    }

    /**
     * The primary check method. Now uses GPT-4o-mini via our internal API.
     * This avoids flagging names, cities (eg. Rourkela), and tech stacks.
     */
    async checkTextAsync(text) {
        if (!text || text.length < 3) return [];

        // 1. Check Cache
        if (this.cache.has(text)) {
            return this.cache.get(text);
        }

        try {
            // CALL INTERNAL AI API
            const response = await fetch('/resumy/api/ai/header-intelligence', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'spellcheck', value: text })
            });

            if (!response.ok) throw new Error('AI SpellCheck API Error');

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                return [];
            }

            const data = await response.json();

            // OpenRouter/GPT can sometimes return markdown backticks
            let cleanResult = data.result || "[]";
            if (cleanResult.includes("```")) {
                cleanResult = cleanResult.replace(/```json|```/g, "").trim();
            }

            const results = JSON.parse(cleanResult);

            if (!Array.isArray(results)) return [];

            // Transform into Front-end format with precise indices
            const errors = results.map(err => {
                // Find index of the word in text
                // Using regex to find word boundaries if possible
                const regex = new RegExp(`\\b${err.word}\\b`, 'i');
                const match = text.match(regex);

                if (!match) return null;

                const index = match.index;

                // Skip if word is in ignore set
                if (this.ignoredWords.has(err.word.toLowerCase()) || this.whitelist.has(err.word.toLowerCase())) {
                    return null;
                }

                return {
                    word: err.word,
                    index: index,
                    length: err.word.length,
                    message: err.message,
                    suggestions: err.suggestions || []
                };
            }).filter(Boolean);

            this.cache.set(text, errors);
            return errors;
        } catch (err) {
            console.error('AI SpellCheck Error:', err);
            return []; // Fallback to no errors
        }
    }

    // Keep synchronous version for legacy callers (returns nothing to avoid UI flickers)
    checkText(text) {
        return this.cache.get(text) || [];
    }

    ignoreWord(word) {
        this.ignoredWords.add(word.toLowerCase());
        this.cache.clear(); // Clear cache to force re-render
    }

    ignoreAll(word) {
        this.ignoredWords.add(word.toLowerCase());
        this.cache.clear();
    }

    // suggestions are now provided by the API in the error object itself
    getSuggestions(word) {
        // This is a fallback if needed
        return [];
    }
}

export const spellChecker = new SpellCheckManager();
