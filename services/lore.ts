import React from 'react';
import type { BreathingStyle } from '../types.ts';

//============== ICONS ==============//
const IronLungIcon: React.FC<{className?: string}> = ({ className }) => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M4 8V6a2 2 0 012-2h2.586a1 1 0 01.707.293l1.414 1.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l1.414-1.414a1 1 0 01.707-.293H20a2 2 0 012 2v2a2 2 0 01-2 2h-1.586a1 1 0 00-.707.293l-1.414 1.414a1 1 0 01-.707-.293h-3.172a1 1 0 01-.707-.293l-1.414-1.414A1 1 0 006.586 10H5a2 2 0 01-2-2z" }), React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 14s.5-1 2-1 2.5 2 5 2 5-2 5-2 1.5 1 2 1" }));
const EmberIcon: React.FC<{className?: string}> = ({ className }) => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.657 7.343A8 8 0 0117.657 18.657z" }));
const WaterFlowIcon: React.FC<{className?: string}> = ({ className }) => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M8 9l4-4 4 4m0 6l-4 4-4-4" }));
const ThunderPulseIcon: React.FC<{className?: string}> = ({ className }) => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M13 10V3L4 14h7v7l9-11h-7z" }));
const MountainHeartIcon: React.FC<{className?: string}> = ({ className }) => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" }), React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 17.657l-1.343-1.343a2 2 0 010-2.828l5.657-5.657-8.486 8.486" }));
const VoidIcon: React.FC<{className?: string}> = ({ className }) => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 8v.01M12 12v.01M12 16v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }));
const SoulResonanceIcon: React.FC<{className?: string}> = ({ className }) => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.636 18.364a9 9 0 010-12.728m2.828 9.9a5 5 0 010-7.072" }));
const InfiniteIcon: React.FC<{className?: string}> = ({ className }) => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h6.172a2 2 0 001.414-.586l.828-.828A2 2 0 0117 4h0z" }));


//============== LEVEL TITLES ==============//
export const LEVEL_TITLES: { [key: number]: string } = {
  30: "The First Door",
  31: "The Mirror Path",
  32: "The Whispering Mind",
  33: "The Discipline Forge",
  34: "The Hunger Game",
  35: "The Noise and the Stillness",
  36: "The Shadow Duel",
  37: "The Iron Morning",
  38: "The Invisible War",
  39: "The Path of Solitude",
  40: "The Mindsmith",
  41: "The Fire Trial",
  42: "The Chainbreaker",
  43: "The Inner Child’s Cry",
  44: "The Thousand Distractions",
  45: "The Storm Within",
  46: "The Dream Architect",
  47: "The Wall of Resistance",
  48: "The Breath of Focus",
  49: "The Broken Sword",
  50: "The Reforging",
  51: "The Code of One",
  52: "The City of Echoes",
  53: "The Doubt Merchant",
  54: "The Night of Temptation",
  55: "The Lost Compass",
  56: "The Garden of Balance",
  57: "The Friend Within",
  58: "The Phantom Fear",
  59: "The Last Excuse",
  60: "The Awakening Flame",
  61: "The Mind King",
  62: "The Architect of Time",
  63: "The Energy Altar",
  64: "The Serpent of Comfort",
  65: "The Edge of Boredom",
  66: "The Momentum Seal",
  67: "The Silent Confidence",
  68: "The Shadow’s Gift",
  69: "The Master of Patterns",
  70: "The Infinite Staircase",
  71: "The Guardian of Truth",
  72: "The River of Regret",
  73: "The Clockwork Soul",
  74: "The Death of the Old Self",
  75: "The New Dawn",
  76: "The Soul Contract",
  77: "The Fire in the Heart",
  78: "The Tower of Flow",
  79: "The Master’s Eye",
  80: "The Mirror Reborn",
  81: "The Gate of Silence",
  82: "The Emperor Within",
  83: "The Golden Chain",
  84: "The 7 Sins Duel",
  85: "The Dream Walker",
  86: "The Lost Heaven",
  87: "The Cosmic Breath",
  88: "The Eye of Stillness",
  89: "The Seed of Infinity",
  90: "The Master Beyond Thought",
  91: "The Shadowless One",
  92: "The Realm of Choice",
  93: "The Final Temptation",
  94: "The Collapse",
  95: "The Rebirth",
  96: "The Unseen Light",
  97: "The God Within",
  98: "The Empty Throne",
  99: "The Great Silence",
  100: "The Beyond"
};

//============== BREATHING STYLES ==============//
export const BREATHING_STYLES: BreathingStyle[] = [
    { name: 'Iron Lung Breathing', unlockLevel: 30, icon: IronLungIcon, description: 'Reclaim control over body and mind.', technique: 'A steady, rhythmic inhale-exhale to sharpen focus & kill procrastination.', whenToUse: 'During moments of distraction or low energy.', structuredTechnique: { reps: 15, steps: [{ type: 'Inhale', duration: 4 }, { type: 'Exhale', duration: 6 }] } },
    { name: 'Ember Breathing', unlockLevel: 40, icon: EmberIcon, description: 'Inner Fire. Discipline becomes weapon.', technique: 'Deep diaphragmatic breath; visualize burning weakness away.', whenToUse: 'When facing fear, shame, or self-hate.', structuredTechnique: { reps: 12, steps: [{ type: 'Inhale', duration: 6 }, { type: 'Hold', duration: 2 }, { type: 'Exhale', duration: 8 }] } },
    { name: 'Water Flow Breathing', unlockLevel: 50, icon: WaterFlowIcon, description: 'Mastery of motion. Balance & rhythm.', technique: 'Inhale in 4 parts, exhale in 4; used for mental clarity & adaptability.', whenToUse: 'When feeling restless, rushed, or burnt out.', structuredTechnique: { reps: 10, steps: [{ type: 'Inhale', duration: 4 }, { type: 'Hold', duration: 1 }, { type: 'Exhale', duration: 4 }, { type: 'Hold', duration: 1 }] } },
    { name: 'Thunder Pulse Breathing', unlockLevel: 60, icon: ThunderPulseIcon, description: 'Power & awareness. Missions unlock.', technique: 'Short, explosive bursts; increase focus speed.', whenToUse: 'When desire, impulse, or emotional chaos invades your focus.', structuredTechnique: { reps: 3, steps: [{ type: 'Inhale', duration: 1 }, { type: 'Exhale', duration: 1 }] } }, // Note: This is a simplified representation of rapid breathing.
    { name: 'Mountain Heart Breathing', unlockLevel: 70, icon: MountainHeartIcon, description: 'Transcendence through pain.', technique: 'Long, slow breaths synced with heartbeat.', whenToUse: 'When facing isolation, false pride, or emotional numbness.', structuredTechnique: { reps: 10, steps: [{ type: 'Inhale', duration: 8 }, { type: 'Exhale', duration: 8 }] } },
    { name: 'Void Breathing', unlockLevel: 80, icon: VoidIcon, description: 'Cosmic awareness. Integration of self.', technique: 'Breath so slow it disappears; observing thought as wind.', whenToUse: 'When facing spiritual arrogance, nihilism, or disconnection.', structuredTechnique: { reps: 8, steps: [{ type: 'Inhale', duration: 10 }, { type: 'Exhale', duration: 15 }] } },
    { name: 'Soul Resonance Breathing', unlockLevel: 90, icon: SoulResonanceIcon, description: 'Awakening. Facing all shadows at once.', technique: 'Harmonize breath + intention + inner voice.', whenToUse: 'When facing your deepest, fused shadows.', structuredTechnique: { reps: 7, steps: [{ type: 'Inhale', duration: 7 }, { type: 'Hold', duration: 2 }, { type: 'Exhale', duration: 7 }] } },
    { name: 'Infinite Breath', unlockLevel: 100, icon: InfiniteIcon, description: 'Enlightenment. No control needed.', technique: 'No inhale, no exhale, just awareness. The state of being, not doing.', whenToUse: 'This is not a technique to be used, but a state to be realized.' },
];


//============== REALMS ==============//
export const REALMS = [
  { levelRange: 'Levels 30-39', name: 'Realm I - The Mortal Breath', theme: 'Discipline. Reclaiming control over body and mind.', breathingStyle: 'Iron Lung Breathing', enemies: 'Laziness, Overthinking, Lust, Distraction, Doubt', eliteDemon: 'Neru, the Whispering Temptation - feeds on wasted time.', boss: 'The Shadow of Comfort - appears as your past self.' },
  { levelRange: 'Levels 40-49', name: 'Realm II - The Forging Flame', theme: 'Inner Fire. Discipline becomes weapon.', breathingStyle: 'Ember Breathing', enemies: 'Fear, Shame, Comparison, Regret, Self-Hate', eliteDemon: 'Rael, the Mirror Keeper - traps you in endless self-judgment.', boss: 'The Fire Trial - endurance of mind & flesh.' },
  { levelRange: 'Levels 50-59', name: 'Realm III - The Flow Veins', theme: 'Mastery of motion. Balance & rhythm.', breathingStyle: 'Water Flow Breathing', enemies: 'Restlessness, Ego, Rush, Burnout', eliteDemon: 'Sura, the Clock Eater - consumes your sense of time.', boss: 'The River of Distraction - an endless cycle you must cross with calm.' },
  { levelRange: 'Levels 60-69', name: 'Realm IV - The Storm Mind', theme: 'Power & awareness. Missions unlock (Solo Leveling style).', breathingStyle: 'Thunder Pulse Breathing', enemies: 'Desire, Impulse, Emotional chaos, Noise', eliteDemon: 'Juro, the Mind Hacker - invades your focus.', boss: 'The Tempest Within - fights you during burnout phase.' },
  { levelRange: 'Levels 70-79', name: 'Realm V - The Ascending Soul', theme: 'Transcendence through pain.', breathingStyle: 'Mountain Heart Breathing', enemies: 'Isolation, False pride, Emotional numbness', eliteDemon: 'Varn, the Silent Pride', boss: 'The Inner King - forces humility or collapse.' },
  { levelRange: 'Levels 80-89', name: 'Realm VI - The Celestial Path', theme: 'Cosmic awareness. Integration of self.', breathingStyle: 'Void Breathing', enemies: 'Spiritual arrogance, Nihilism, Disconnection', eliteDemon: 'Kael, the Hollow Saint', boss: 'The Void Gate Guardian - tests your detachment.' },
  { levelRange: 'Levels 90-99', name: 'Realm VII - The Beyond Flesh', theme: 'Awakening. Facing all shadows at once.', breathingStyle: 'Soul Resonance Breathing', enemies: 'All 12 Kazuki return fused as "The Legion."', eliteDemon: 'Orin, the Devourer of Purpose', boss: 'The False God - your Ego reborn as Light.' },
  { levelRange: 'Levels 100', name: 'Realm VIII - The Eternal Silence', theme: 'Enlightenment.', breathingStyle: 'Infinite Breath', enemies: 'None. Only the self remains.', eliteDemon: 'N/A', boss: 'The Source, also known as Desire Itself.' },
];
