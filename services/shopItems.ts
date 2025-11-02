import React from 'react';
import type { ShopItem } from '../types.ts';

const PhysiqueIcon: React.FC<{className?: string}> = ({ className }) => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { d: "M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" }), React.createElement('path', { d: "M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" }), React.createElement('path', { d: "M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" }));
const IntellectIcon: React.FC<{className?: string}> = ({ className }) => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a15.045 15.045 0 01-7.5 0C4.508 19.64 2.25 15.223 2.25 10.5 2.25 5.224 6.724 1.5 12 1.5c5.276 0 9.75 3.724 9.75 9 0 4.723-2.258 9.14-5.25 11.411z" }));
const MemoryIcon: React.FC<{className?: string}> = ({ className }) => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" }));

const HealthIcon: React.FC<{className?: string}> = ({ className }) => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" }));
const WealthIcon: React.FC<{className?: string}> = ({ className }) => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0h.75A.75.75 0 015.25 6v.75m0 0v-.75A.75.75 0 015.25 4.5h-.75m0 0h-.75A.75.75 0 003 5.25v.75M3 15v-1.5A.75.75 0 013.75 12h.75m0 0h.75a.75.75 0 01.75.75v1.5m0 0v.75a.75.75 0 01-.75.75h-.75m0 0h-.75a.75.75 0 01-.75-.75v-.75m3-6.75A.75.75 0 015.25 9h.75m0 0h.75a.75.75 0 01.75.75v.75m0 0v.75a.75.75 0 01-.75.75h-.75M9 15h.008v.008H9v-.008zm.75-4.5h.008v.008H9.75v-.008zm.75 4.5h.008v.008h-.008v-.008zm.75-4.5h.008v.008h-.008v-.008zm.75 4.5h.008v.008h-.008v-.008zm.75-4.5h.008v.008h-.008v-.008zm.75 4.5h.008v.008h-.008v-.008zm.75-4.5h.008v.008h-.008v-.008zm.75 4.5h.008v.008h-.008v-.008z" }));
const MindIcon: React.FC<{className?: string}> = ({ className }) => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.5 21.75l-.398-1.178a3.375 3.375 0 00-2.456-2.456L12.5 18l1.178-.398a3.375 3.375 0 002.456-2.456L16.5 14.25l.398 1.178a3.375 3.375 0 002.456 2.456L20.25 18l-1.178.398a3.375 3.375 0 00-2.456 2.456z" }));
const SoulIcon: React.FC<{className?: string}> = ({ className }) => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className, fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 00-4.24-1.228 8.25 8.25 0 00-4.244 1.228 8.287 8.287 0 00-1.245 4.244c-.02.163-.038.328-.052.494a8.25 8.25 0 005.254 6.254 8.287 8.287 0 005.932.164A8.25 8.25 0 0021 12a8.25 8.25 0 00-5.638-7.786z" }));


export const ALL_SHOP_ITEMS: ShopItem[] = [
    {
        id: 'Intellect',
        name: 'Cerebral Catalyst',
        description: 'Permanently sharpen your reasoning and problem-solving skills. A sharper mind finds clearer paths.',
        costPerPoint: 20,
        icon: IntellectIcon,
        promptSuggestion: "Devise a strategy to solve a complex logical puzzle or a real-world problem presented in the mission."
    },
    {
        id: 'Physique',
        name: 'Iron Foundation',
        description: 'Permanently increase your baseline physical strength and resilience. A strong body houses a strong mind.',
        costPerPoint: 15,
        icon: PhysiqueIcon,
        promptSuggestion: "Complete a new, challenging physical exercise or workout routine that pushes your current limits."
    },
    {
        id: 'Memory',
        name: 'Mnemonic Weave',
        description: 'Permanently enhance your ability to recall information and learn new skills. Remember the lessons of the past.',
        costPerPoint: 18,
        icon: MemoryIcon,
        promptSuggestion: "Memorize a significant piece of information (a poem, a list, a formula) and apply it."
    },
    {
        id: 'Health',
        name: 'Vitality Core',
        description: 'Permanently boost your health and energy reserves. A vital life force is essential for the long journey.',
        costPerPoint: 10,
        icon: HealthIcon,
        promptSuggestion: "Prepare and consume a specific, highly nutritious meal or complete a restorative health practice."
    },
];