import type { AbilityLore } from '../types.ts';
import { ALL_SHOP_ITEMS } from './shopItems.ts';

const [intellect, physique, memory] = ALL_SHOP_ITEMS;

export const ALL_ABILITIES: AbilityLore[] = [
    {
        id: 'Intellect',
        name: intellect.name,
        description: intellect.description,
        icon: intellect.icon,
        xpPerLevel: 150,
        levels: [
            {
                level: 1,
                title: "The Novice's Mind",
                description: "Begin by understanding the foundational principles of clear thought and effective learning.",
                skills: [
                    { name: 'The Feynman Technique', description: "A method for learning any topic by explaining it in simple terms, identifying gaps in your knowledge, and refining your understanding." },
                    { name: 'Active Recall', description: "Actively retrieve information from memory rather than passively re-reading it. Use flashcards or try to summarize a topic without looking at your notes." },
                    { name: 'Spaced Repetition', description: "Review information at increasing intervals over time to strengthen memory retention and combat the forgetting curve." },
                ]
            },
            {
                level: 2,
                title: "The Apprentice's Logic",
                description: "Learn to deconstruct problems and arguments to understand their core components.",
                skills: [
                    { name: 'First-Principles Thinking', description: "Break down complex problems into their most basic, fundamental truths and reason up from there, rather than relying on analogy or convention." },
                    // FIX: Changed single quotes to double quotes to correctly handle the apostrophe in "Occam's Razor".
                    { name: "Occam's Razor", description: "When faced with competing hypotheses, select the one that makes the fewest assumptions. Simpler explanations are more likely to be true." },
                    { name: 'Cognitive Bias Awareness', description: "Begin to study common cognitive biases (like confirmation bias or anchoring) to recognize them in your own thinking and in others." },
                ]
            },
            {
                level: 3,
                title: "The Journeyman's Models",
                description: "Expand your toolkit with mental models that provide new frameworks for understanding the world.",
                skills: [
                    { name: 'Second-Order Thinking', description: "Train yourself to think beyond the immediate result of a decision. Ask 'And then what?' to consider the long-term consequences." },
                    { name: 'Inversion', description: "Instead of thinking about how to achieve a goal, think about what you want to avoid. 'Invert, always invert' to identify and remove obstacles to success." },
                    { name: 'Circle of Competence', description: "Clearly define the areas where you have deep knowledge and expertise. Operate within this circle and be cautious when venturing outside it." },
                ]
            }
        ]
    },
    {
        id: 'Physique',
        name: physique.name,
        description: physique.description,
        icon: physique.icon,
        xpPerLevel: 200,
        levels: [
            {
                level: 1,
                title: "Foundational Movement",
                description: "Master the basic principles of bodyweight strength and consistency before adding complexity.",
                skills: [
                    { name: 'Bodyweight Mastery', description: "Focus on perfect form for fundamental exercises: push-ups, squats, lunges, and planks. Quality over quantity." },
                    { name: 'Consistency over Intensity', description: "Establish a consistent routine, even if it's just 15-20 minutes a day. The habit is more important than the single heroic workout." },
                    { name: 'Active Recovery', description: "Incorporate light activity like walking or stretching on rest days to aid muscle repair and reduce soreness." },
                ]
            },
            {
                level: 2,
                title: "Progressive Overload",
                description: "Understand the core principle of getting stronger: systematically increasing the demands on your body.",
                skills: [
                    { name: 'Increase Reps/Sets', description: "The simplest way to progress. Add one more rep to each set, or one more set to each exercise over time." },
                    { name: 'Decrease Rest Time', description: "Slightly reduce the rest time between sets to increase the density and cardiovascular challenge of your workout." },
                    { name: 'Introduce Variations', description: "Make exercises harder. Progress from knee push-ups to full push-ups, or from squats to pistol squat progressions." },
                ]
            },
            {
                level: 3,
                title: "Nutritional Discipline",
                description: "Your physique is forged in your workouts but revealed by your diet. Focus on the building blocks.",
                skills: [
                    { name: 'Prioritize Protein', description: "Ensure you are consuming an adequate amount of protein (e.g., from lean meats, legumes, or dals) to support muscle repair and growth." },
                    { name: 'Hydration as a Priority', description: "Treat water as a key component of your fitness. Dehydration can significantly impair performance." },
                    { name: 'Mindful Eating', description: "Pay attention to your food. Eat slowly and without distraction to better recognize your body's hunger and satiety cues." },
                ]
            }
        ]
    },
    {
        id: 'Memory',
        name: memory.name,
        description: memory.description,
        icon: memory.icon,
        xpPerLevel: 180,
        levels: [
            {
                level: 1,
                title: "The Art of Association",
                description: "Our brains remember things that are connected. The first step is to create those connections deliberately.",
                skills: [
                    { name: 'The Link System', description: "To remember a list of items, create a vivid and often absurd story or image that connects one item to the next." },
                    { name: 'Chunking', description: "Break down large pieces of information (like a phone number) into smaller, more manageable 'chunks' (e.g., 555-123-4567)." },
                    { name: 'Acronyms and Mnemonics', description: "Create a memorable phrase or word where each letter stands for an item you need to remember (e.g., ROY G. BIV for the colors of the rainbow)." },
                ]
            },
            {
                level: 2,
                title: "The Palace of the Mind",
                description: "Use spatial memory to store and recall vast amounts of information with incredible accuracy.",
                skills: [
                    { name: 'Method of Loci (The Memory Palace)', description: "Visualize a familiar place (like your home) and 'place' items you want to remember in specific locations along a set route. To recall, simply 'walk' the route." },
                    { name: 'The Major System', description: "A phonetic system that turns numbers into consonants, allowing you to create words and images from numbers to make them more memorable." },
                    { name: 'Name Association', description: "When meeting someone new, associate their name with a prominent feature or a rhyming image to drastically improve recall (e.g., 'Mike has a bike')." },
                ]
            },
            {
                level: 3,
                title: "Cognitive Lifestyle",
                description: "Forge habits and a lifestyle that support and enhance your brain's natural memory functions.",
                skills: [
                    { name: 'The Importance of Sleep', description: "Recognize that sleep is not passive. It's when your brain consolidates memories, transferring them from short-term to long-term storage." },
                    { name: 'Nutrition for the Brain', description: "Incorporate brain-healthy foods rich in Omega-3s, antioxidants, and vitamins (e.g., fatty fish, blueberries, walnuts) into your diet." },
                    { name: 'Novelty and Challenge', description: "Regularly engage in activities that challenge your brain in new ways, like learning a new skill, playing an instrument, or reading a book on an unfamiliar subject." },
                ]
            }
        ]
    }
];