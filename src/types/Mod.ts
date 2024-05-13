import { Game } from "./Game";
export type Mod = {
    id: string;             // Mod ID
    name: string;           // Mod name
    version: string;        // Version number
    author: string | string[];       // Author(s) User ID
    brief: string;          // Brief description
    description: string;    // Full description
    tags: string[];         // Tags
    dependencies: string[]; // Dependencies, by mod ID
    banner?: string;        // Banner image URL
    icon: string;           // Icon image URL
    game: Game;             // Game supported
    links: {
        website: string;    // Website URL
        discord: string;    // Discord invite URL
        github: string;     // GitHub URL
    };
    created: number;        // Creation timestamp
    updated: number;        // Last update timestamp
    published: number;      // Publish timestamp
    flags: {
        hidden: boolean;    // Prevent listing in public mod lists
        locked: boolean;    // Prevent updates
        archived: boolean;  // Prevent updates and hide from public mod lists
        nsfw: boolean;      // Prevent SFW users from seeing
        removed: boolean;   // Marked for deletion
    };
    notes: string;          // Notes for moderators
    approvedBy: string[];   // Moderator(s) that approved the mod
    files: {
        [key: string]: {
            url: string;    // File URL
            size: number;   // File size in bytes
            hash: string;   // SHA-256 hash
            created: number; // Creation timestamp
            versions: string[]; // Supported game versions
            beta: boolean;  // Beta flag
            modLoader?: string; // Mod loader, if applicable
        }
    }
}