// Implemented Gemini Service to dynamically generate missions for the player.
import { GoogleGenAI, Type } from "@google/genai";
import type { Mission } from '../types.js';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

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
        
        Do not repeat any of these existing mission titles from today or previous days: ${existingMissionTitles.join(', ')}.
        Ensure one unique mission is generated for each requested category.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: createMissionSchema(categories),
                temperature: 0.8,
            }
        });

        const jsonText = response.text.trim();
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
        return fallbackMissions;
    }
};
