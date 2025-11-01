// Implemented level descriptions to provide lore and context to the player's progression.
export interface LevelInfo {
    level: number;
    title: string;
    description: string;
}

export const LEVEL_DESCRIPTIONS: LevelInfo[] = Array.from({ length: 71 }, (_, i) => {
    const level = i + 30;
    let title = `Level ${level}`;
    let description = `The path continues. Stay focused, Wanderer.`;

    if (level === 30) {
        title = "The First Step";
        description = "You have chosen to walk the path. The fog of modern life is thick, but your journey to clarity has begun.";
    }
    if (level === 40) {
        title = "The Forge of Will";
        description = "Discipline is not a gift, but a muscle. You have begun to train it. Consistency is now your greatest ally.";
    }
    if (level === 50) {
        title = "The Eye of the Storm";
        description = "You have learned to find stillness amidst chaos. The world will test you, but your center will hold.";
    }
    if (level === 100) {
        title = "Enlightenment";
        description = "You have reached the summit. The path does not end, but your perspective has changed forever. You are the Sage.";
    }

    return {
        level,
        title,
        description,
    };
});
