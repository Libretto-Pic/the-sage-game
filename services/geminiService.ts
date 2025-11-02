// Implemented Gemini Service to dynamically generate missions for the player.
import { GoogleGenAI, Type } from "@google/genai";
import type { Mission, MissionCategory, StatCategory, Kazuki } from '../types.ts';

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

const missionSchemaProperties = {
    title: {
        type: Type.STRING,
        description: "A short, engaging title for the mission (e.g., 'Hydration Ritual' or '15-Minute Focus Sprint')."
    },
    description: {
        type: Type.STRING,
        description: "A one-sentence, clear description of the task. Be specific and measurable (e.g., 'Drink 2 liters of water today.' or 'Work on a single task without distractions for 15 minutes.')."
    },
    difficulty: {
        type: Type.STRING,
        description: "The difficulty of the mission. Must be one of: 'Easy', 'Medium', or 'Hard'."
    },
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
                        ...missionSchemaProperties,
                        category: {
                            type: Type.STRING,
                            description: `The category of the mission. Must be one of: ${categories.join(', ')}.`
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
    properties: missionSchemaProperties,
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
                temperature: 1.0,
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

export const generateActivationMission = async (level: number, stat: StatCategory, points: number, cost: number, suggestion: string): Promise<Omit<Mission, 'id' | 'isCompleted' | 'xp' | 'category'>> => {
    const difficultyMap = {
        low: cost <= 15 ? 'Easy' : 'Medium',
        medium: cost <= 50 ? 'Medium' : 'Hard',
        high: 'Hard'
    }
    const difficulty = cost > 100 ? difficultyMap.high : cost > 25 ? difficultyMap.medium : difficultyMap.low;
    
    const prompt = `
        You are The Sage. A user (Level ${level}) has spent ${cost} Soul Coins to increase their permanent '${stat}' stat by ${points}.
        They must complete a special "Activation Trial" to unlock this boost.
        Generate a single, thematic, and challenging mission for this trial.
        The mission's difficulty should be '${difficulty}' to reflect the significant investment.
        The title MUST start with "Activation Trial:".
        The description should be inspiring and clearly state the task.
        Here is a suggestion for the task: "${suggestion}". Embellish it or create a similar, thematically appropriate one.
        For 'Health' missions, you can include suggestions for common, healthy Pakistani food from the KPK region, like 'Peshawari Karahi' (made with less oil) or 'Kabuli Pulao' (with lean meat and more vegetables).
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: singleMissionSchema,
                temperature: 0.8,
            }
        });
        const jsonText = extractJson(response.text.trim());
        const parsed = JSON.parse(jsonText);
        if (parsed.title && parsed.description && parsed.difficulty) {
            return parsed;
        }
        throw new Error("Invalid format from AI.");
    } catch (error) {
        console.error("Error generating activation mission:", error);
        return {
            title: `Activation Trial: The Test of ${stat}`,
            description: `The Sage could not forge a unique trial. Instead, perform this rite: dedicate 90 minutes of deep, unbroken focus to improving your ${stat}.`,
            difficulty: 'Hard'
        };
    }
};

export const generateKazukiTrialMission = async (level: number, kazuki: Kazuki): Promise<Omit<Mission, 'id' | 'isCompleted' | 'xp' | 'category'>> => {
    const prompt = `
        You are The Sage. A user (Level ${level}) has just encountered the Kazuki named ${kazuki.name} (${kazuki.title}).
        This Kazuki's domain is '${kazuki.domain}', and its weaknesses include '${kazuki.weaknesses.join(', ')}'.
        Generate a single, unique, thematic, and challenging mission that serves as a "Trial" for this Kazuki.
        The mission MUST be a 'Hard' difficulty task the user can perform to prove their resolve against this specific demon.
        The task should be directly related to countering the Kazuki's domain and exploiting its weaknesses.
        For example, for a demon of Distraction, a trial could be a long period of unbroken focus. For a demon of Comfort, it could be a difficult physical or mental challenge.
        The title should be inspiring and thematic, but DO NOT include "Trial of ${kazuki.name}" in the title itself.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: singleMissionSchema,
                temperature: 0.8,
            }
        });
        const jsonText = extractJson(response.text.trim());
        const parsed = JSON.parse(jsonText);
        if (parsed.title && parsed.description && parsed.difficulty) {
            // Ensure difficulty is hard as requested
            parsed.difficulty = 'Hard';
            return parsed;
        }
        throw new Error("Invalid format from AI for Kazuki trial.");
    } catch (error) {
        console.error("Error generating Kazuki trial mission:", error);
        return {
            title: `The Unbreakable Will`,
            description: `Face the domain of ${kazuki.name}. Meditate for 20 minutes on this demon's nature and how it manifests in your life. Write down your reflections.`,
            difficulty: 'Hard'
        };
    }
};

const ABILITY_TEST_PROMPTS: Record<StatCategory, string> = {
    'Intellect': "test logic, critical thinking, problem-solving, or creativity",
    'Physique': "test their knowledge of fitness principles, anatomy, or nutrition in a practical, non-trivia way",
    'Memory': "test their ability to recall, associate, or structure information creatively",
    'Health': '', 'Wealth': '', 'Mind': '', 'Soul': ''
};

export const generateAbilityTestQuestion = async (ability: StatCategory, level: number): Promise<string> => {
    const test_topic = ABILITY_TEST_PROMPTS[ability] || "test their general wisdom and dedication";
    const prompt = `
      You are The Sage. A user has reached Level ${level} in the ability of '${ability}'.
      Generate one challenging, open-ended question to test their worthiness.
      The question should not be a trivia question. It must ${test_topic}.
      The question should be solvable without external tools but require deep thought.
      Example themes: A logic puzzle, a moral dilemma, a strategic problem, a creative scenario.
      Keep the question concise (2-4 sentences).
    `;
     try {
        const response = await ai.models.generateContent({ model, contents: prompt });
        return response.text;
    } catch (error) {
        console.error("Error generating test question:", error);
        return "A classic riddle: What has an eye, but cannot see?"; // Fallback
    }
};

const evaluationSchema = {
    type: Type.OBJECT,
    properties: {
        evaluation: { type: Type.STRING, description: "A short, one-sentence critique or praise of the user's answer. Be encouraging but honest." },
        isWorthy: { type: Type.BOOLEAN, description: "True if the answer shows thoughtfulness, effort, and intelligence relative to the question. False otherwise." }
    },
    required: ["evaluation", "isWorthy"]
};

export const evaluateAbilityTestAnswer = async (question: string, answer: string, ability: StatCategory): Promise<{evaluation: string, isWorthy: boolean}> => {
     const prompt = `
      As The Sage, evaluate a user's answer to a test for the ability '${ability}'.
      The question was: "${question}"
      The user's answer is: "${answer}"
      
      Your task is to determine if the answer demonstrates thoughtfulness, logic, and a genuine attempt to engage with the problem. It doesn't need to be "correct," but it must show effort relevant to the ability being tested.
      - A simple "I don't know" or a nonsensical answer is not worthy.
      - A well-reasoned, even if flawed, answer is worthy.
      - A creative or insightful answer is highly worthy.

      Provide your response in a JSON object.
    `;
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: evaluationSchema,
            }
        });
        const jsonText = extractJson(response.text.trim());
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error evaluating answer:", error);
        return { evaluation: "The Sage's connection is weak. Your answer could not be properly evaluated. Please try again.", isWorthy: false };
    }
};