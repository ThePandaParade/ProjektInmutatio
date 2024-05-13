export type Game = {
    id: string;             // Game ID
    name: string;           // Game name
    versions: string[];     // List of game versions
    modLoaders: string[];   // List of mod loaders
    boxArt: string;         // Box art image URL
    banner: string;         // Banner image URL
    description: string;    // Full description
    website: string;        // Website URL
    publisher: string;      // Publisher name
    developer: string;      // Developer name
    released: number;       // Release timestamp
}