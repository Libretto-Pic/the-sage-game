// Implemented Gemini Service to dynamically generate missions for the player.
import { GoogleGenAI, Type } from "@google/genai";
import type { Mission, MissionCategory } from '../types.ts';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

// Helper to extract JSON from a string that might contain other text
const extractJson = (text: string): string => {
    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}');
    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        return text.substring(startIndex, endIndex + 1);
    }
    // For array responses
    const arrayStartIndex = text.indexOf('[');
    const arrayEndIndex = text.lastIndexOf(']');
    if (arrayStartIndex !== -1 && arrayEndIndex !== -1 && arrayEndIndex > arrayStartIndex) {
        return text.substring(arrayStartIndex, arrayEndIndex + 1);
    }
    return text; // Fallback to original text if no clear JSON object/array found
};

const createMissionSchema = (categories: string[]) => {
    return {
        type: Type.OBJECT,
        properties: {
            missions: {
                type: Type.ARRAY,
                description: `An array of ${categories.length} unique and actionable missions, one for each requested category.`,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: {
                            type: Type.STRING,
                            description: "A short, engaging title for the mission (e.g., 'Hydration Ritual' or '15-Minute Focus Sprint')."
                        },
                        description: {
                            type: Type.STRING,
                            description: "A one-sentence, clear description of the task. Be specific and measurable (e.g., 'Drink 2 liters of water today.' or 'Work on a single task without distractions for 15 minutes.')."
                        },
                        category: {
                            type: Type.STRING,
                            description: `The category of the mission. Must be one of: ${categories.join(', ')}.`
                        },
                        difficulty: {
                            type: Type.STRING,
                            description: "The difficulty of the mission. Must be one of: 'Easy', 'Medium', or 'Hard'."
                        },
                    },
                    required: ["title", "description", "category", "difficulty"]
                }
            }
        }
    };
};


export const generateNewMissions = async (level: number, existingMissionTitles: string[], categories: string[]): Promise<Omit<Mission, 'id' | 'isCompleted' | 'xp'>[]> => {
    if (categories.length === 0) {
        return [];
    }
    
    const prompt = `
        You are The Sage, a guide in a life gamification app called "The Sage's Path". 
        Your user is at Level ${level}.
        Generate ${categories.length} new, unique, and actionable daily missions for the user.
        Provide one mission for each of the following categories: ${categories.join(', ')}.
        The missions should be simple, concrete, and completable within a day.
        
        Assign a difficulty ('Easy', 'Medium', or 'Hard') appropriate for Level ${level}.
        - Levels 30-45: Generate mostly 'Easy' missions, with one 'Medium' at most.
        - Levels 46-70: A mix of 'Easy' and 'Medium' missions. Occasionally, one 'Hard' mission if it fits a theme.
        - Levels 71+: Mostly 'Medium' and 'Hard' missions to challenge the user.
        
        To ensure variety, create missions that are conceptually different from these recent ones. Do not repeat titles.
        Recent missions to avoid: ${existingMissionTitles.join(', ')}.
        If the list of missions to avoid is empty, generate good starting missions for the requested categories.
        Ensure one unique mission is generated for each requested category.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: createMissionSchema(categories),
                temperature: 0.9,
            }
        });

        const jsonText = extractJson(response.text.trim());
        const parsed = JSON.parse(jsonText);
        
        if (parsed.missions && Array.isArray(parsed.missions) && parsed.missions.length >= categories.length) {
            const returnedCategories = new Set(parsed.missions.map(m => m.category));
            const allCategoriesPresent = categories.every(c => returnedCategories.has(c));

            if (allCategoriesPresent) {
                 return parsed.missions.slice(0, categories.length).map((mission: any) => ({
                    title: mission.title,
                    description: mission.description,
                    category: mission.category,
                    difficulty: mission.difficulty,
                }));
            }
        }
        
        console.error("Generated missions did not meet criteria:", parsed);
        throw new Error("Failed to generate valid missions from AI.");

    } catch (error) {
        console.error("Error generating missions with Gemini API:", error);
        // Fallback for only the requested categories
        const fallbackMissions: Omit<Mission, 'id' | 'isCompleted' | 'xp'>[] = [];
        if (categories.includes('Health')) fallbackMissions.push({ title: 'Walk for 15 Minutes', description: 'Step outside and get your body moving.', category: 'Health', difficulty: 'Easy' });
        if (categories.includes('Wealth')) fallbackMissions.push({ title: 'Read One Industry Article', description: 'Stay updated with trends in your field.', category: 'Wealth', difficulty: 'Easy' });
        if (categories.includes('Mind')) fallbackMissions.push({ title: '5-Minute Meditation', description: 'Clear your mind and find your center.', category: 'Mind', difficulty: 'Easy' });
        if (categories.includes('Soul')) fallbackMissions.push({ title: 'Moment of Stillness', description: 'Sit in silence for 5 minutes, focusing only on your breath.', category: 'Soul', difficulty: 'Easy'})
        return fallbackMissions.filter(m => categories.includes(m.category));
    }
};

const singleMissionSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "A short, engaging title for the mission."
        },
        description: {
            type: Type.STRING,
            description: "A one-sentence, clear description of the task. Be specific and measurable."
        },
        difficulty: {
            type: Type.STRING,
            description: "The difficulty of the mission. Must be one of: 'Easy', 'Medium', or 'Hard'."
        },
    },
    required: ["title", "description", "difficulty"]
};

export const generateSingleMission = async (level: number, existingMissionTitles: string[], category: MissionCategory): Promise<Omit<Mission, 'id' | 'isCompleted' | 'xp' | 'category'>> => {
    const prompt = `
        You are The Sage, a guide in a life gamification app called "The Sage's Path". 
        Your user is at Level ${level}.
        Generate one new, unique, and actionable daily mission for the user, specifically for the '${category}' category.
        The mission should be simple, concrete, and completable within a day.
        
        Assign a difficulty ('Easy', 'Medium', or 'Hard') appropriate for Level ${level}.
        - Levels 30-45: Generate an 'Easy' or 'Medium' mission.
        - Levels 46-70: A mix of 'Easy' and 'Medium' missions.
        - Levels 71+: Mostly 'Medium' and 'Hard' missions to challenge the user.
        
        To ensure variety, create a mission that is conceptually different from these recent ones. Do not repeat titles.
        Recent missions to avoid: ${existingMissionTitles.join(', ')}.
        If the list of missions to avoid is empty, generate a good starting mission for the '${category}' category.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: singleMissionSchema,
                temperature: 1.0, // Increased temperature for more variety
            }
        });

        const jsonText = extractJson(response.text.trim());
        const parsed = JSON.parse(jsonText);
        
        if (parsed.title && parsed.description && parsed.difficulty) {
            return {
                title: parsed.title,
                description: parsed.description,
                difficulty: parsed.difficulty,
            };
        }
        
        console.error("Generated single mission did not meet criteria:", parsed);
        throw new Error("Failed to generate a valid mission from AI.");

    } catch (error) {
        console.error(`Error generating single ${category} mission with Gemini API:`, error);
        // Fallback with a bit of randomness to avoid repetitive fallbacks
        // FIX: Explicitly type the fallbacks object to ensure the 'difficulty' property matches the Mission type.
        const fallbacks: Record<MissionCategory, { title: string; description: string; difficulty: 'Easy' | 'Medium' | 'Hard' }[]> = {
            'Health': [
                { title: '15-Minute Stretch', description: 'Perform a full-body stretching routine.', difficulty: 'Easy' },
                { title: 'Hydration Check', description: 'Ensure you drink at least 2 liters of water today.', difficulty: 'Easy' },
            ],
            'Wealth': [
                { title: 'Review Finances', description: 'Spend 10 minutes reviewing your bank accounts and budget.', difficulty: 'Easy' },
                { title: 'Learn a Micro-Skill', description: 'Watch a 10-minute tutorial on a skill related to your career.', difficulty: 'Easy' },
            ],
            'Mind': [
                { title: '10-Minute Reading', description: 'Read a book or an insightful article for 10 minutes.', difficulty: 'Easy' },
                { title: 'Mindful Observation', description: 'Spend 5 minutes observing an object in detail, using all your senses.', difficulty: 'Easy' },
            ],
            'Soul': [
                { title: 'Gratitude Journal', description: 'Write down three things you are genuinely grateful for.', difficulty: 'Easy' },
                { title: 'Digital Detox', description: 'Spend 30 minutes away from all screens.', difficulty: 'Easy' },
            ]
        };
        const categoryFallbacks = fallbacks[category];
        return categoryFallbacks[Math.floor(Math.random() * categoryFallbacks.length)];
    }
};