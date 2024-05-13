export type User = {
    id: string;             // User ID
    username: string;       // Username
    name: string;           // Display name
    email: string;          // Email (hashed for security)
    emailDomain: string;    // Email domain (just the first three letters of the domain, for security)
    //password: string;     // Password
    // We plan on launching passwordless, so we don't need to store passwords
    verification: {
        passkey: boolean;   // Physical key enabled
        app: boolean;       // 2FA app enabled
        // For security, we don't support SMS or email 2FA
    }
    avatar?: string;        // Avatar image URL
    bio: string;            // User bio
    website: string;        // Website URL
    socials: string[];      // List of social media URLs
    joined: number;         // Join timestamp
    lastSeen: number;       // Last seen timestamp
    mods: string[];         // List of mod IDs
    reviews: string[];      // List of review IDs
    comments: string[];     // List of comment IDs
    likes: string[];        // List of liked review IDs
    dislikes: string[];     // List of disliked review IDs
    followers: string[];    // List of follower IDs
    following: string[];    // List of following IDs
    pronouns: string[];    // List of pronouns
    flags: {
        isBanned: boolean;      // User is banned
        isRestricted: boolean;  // User is restricted
        isVerified: boolean;    // User is verified
        verifiedEmail: boolean; // User has verified their email
        staff: {
            moderator: boolean; // User is a moderator
            developer: boolean; // User is a developer
            admin: boolean;     // User is an admin
            super: boolean;     // User is a super admin - FULL ACCESS TO THE SITE, INCLUDING MODIFIYING OTHER USERS
        }
    };
    settings: {             // User settings
        theme: string;      // Theme name
        language: string;   // Language code
        timezone: string;   // Timezone name
    };
}