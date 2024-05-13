import { User } from "../../../types/User";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
export function v1UserHandler(fastify: any, _: any, done: any) {
    
    fastify.get("/health", async (req: any, res: any) => {
        // Check if the module is imported
        return { "status": "OK" };
    });

    fastify.post("/create",{
        config: {
            rateLimit: {
                max: 1,
                timeWindow: "10 minutes"
            }
        }
    }, async (req: any, res: any) => {
        // We need to create a user
        // All the data is in req.body
        let user: User = req.body;
        let userExists = false;
        // We need to check if the username or email already exists
        // let userCheck = await fastify.db.collection("users").findOne({$or: [{username: user.username}, {email: user.email}]});
        // For now, we will check in redis
        // We need to loop through all the keys in redis, and if any of them match the username or email, we need to return an error
        let keys = await fastify.redis.keys("*");
        // Set the email domain
        user.emailDomain = user.email.split("@")[1].split(".")[0].substring(0, 3);
        // To save time, we encrypt the email out of the loop.
        user.email = await bcrypt.hash(user.email, 10);
        for (let key of keys) {
            let userCheck = await fastify.redis.get(key);
            // JSONify the user, if it errors, skip
            try {
                userCheck = JSON.parse(userCheck);
            } catch (e) {
                continue;
            }
            // Check if the username or email matches
            // To begin with, username check.
            if (userCheck.username.toLocaleLowerCase() == user.username.toLocaleLowerCase()) {
                userExists = true;
                break;
            }
            // Next, email check.
            if (await bcrypt.compare(user.email, userCheck.email)) {
                userExists = true;
                break;
            }
        }
        if (userExists) {
            return { "status": "FAIL", "reason": "Username or email already exists" };
        }
        // We now need to generate a *unique* ID for the user
        let id = uuidv4();
        // Set the ID
        user.id = id;
        // Set the joined timestamp
        user.joined = Date.now();
        // Set the last seen timestamp
        user.lastSeen = Date.now();
        // Set the flags
        user.flags = {
            isBanned: false,
            isRestricted: false,
            isVerified: false,
            verifiedEmail: false,
            staff: {
                moderator: false,
                developer: false,
                admin: false,
                super: false
            }
        };
        // Set the settings
        user.settings = {
            theme: "light",
            language: "en",
            timezone: "UTC"
        };
        // Nullify the mod, review, comment, like, dislike, follower, and following lists
        user.mods = [];
        user.reviews = [];
        user.comments = [];
        user.likes = [];
        user.dislikes = [];
        user.followers = [];
        user.following = [];
        user.pronouns = [];
        user.website = "";
        user.bio = "";
        // For now, set the name to the username
        user.name = user.username;
        // Insert the user into the database
        // await fastify.db.collection("users").insertOne(user);
        // For now, we will add the user to redis instead
        await fastify.redis.set(user.id, JSON.stringify(user));
        // Create a session token for the user
        let sessionToken = await bcrypt.hash(user.id + "API Version 1", 10);
        // Encrypt the user ID and add it to the session token
        sessionToken = sessionToken + "." + Buffer.from(user.id).toString("base64");
        // Add the session token to the token database, using an encrypted user ID as the key
        // await fastify.db.collection("tokens").insertOne({id: Buffer.from(user.id).toString("base64"), token: sessionToken});
        // For now, we will add the token to redis
        await fastify.redis.set(Buffer.from(user.id).toString("base64"), sessionToken);
        
        // Return the user
        return { "status": "OK", "user": user, "sessionToken": sessionToken};
    });

    fastify.get("/get/:id", async (req: any, res: any) => {
        // Get a user by their ID
        let id = req.params.id;
        // Get the user from the database
        // let user = await fastify.db.collection("users").findOne({id: id});
        // For now, we will get the user from redis
        let user = await fastify.redis.get(id);
        if (!user) {
            return { "status": "FAIL", "reason": "User not found" };
        }
        return { "status": "OK", "user": JSON.parse(user) };
    });

    fastify.patch("/update/:id", async (req: any, res: any) => {
        // Update a user by their ID
        let id = req.params.id;
        let update = req.body;
        // Get the user from the database
        // let user = await fastify.db.collection("users").findOne({id: id});
        // For now, we will get the user from redis
        let user = await fastify.redis.get(id);
        if (!user) {
            return { "status": "FAIL", "reason": "User not found" };
        }
        // First, we need to check if the user being updated is the same as the user making the request
        // We need to get the session token from the headers
        let sessionToken = req.headers["authorization"];
        // Encrypt the user ID with base64 and see if any entry matches
        let databaseEntry = await fastify.redis.get(Buffer.from(id).toString("base64"));
        if (!databaseEntry) {
            return { "status": "FAIL", "reason": "User not found"};
        }
        // Rehash the session token
/*         let reHash = await bcrypt.hash(id + "API Version 1", 10);
        reHash = reHash + "." + Buffer.from(id).toString("base64");
        console.log(reHash, sessionToken, databaseEntry)
        console.log(reHash != sessionToken, reHash != databaseEntry, sessionToken != databaseEntry) */
        // Check if the session token matches both the rehashed token and the database token
        console.log(sessionToken, databaseEntry)
        if (sessionToken != databaseEntry) {
            return { "status": "FAIL", "reason": "Unauthorized" };
        }

        // Parse the user
        user = JSON.parse(user);
        const updatedKeys = []
        // Check for differences, and update the user
        // If the email is different, we need to rehash it
        if (update.email) {
            user.email = await bcrypt.hash(update.email, 10);
        }
        // If the email domain is different, we need to update it
        if (update.emailDomain) {
            user.emailDomain = update.email.split("@")[1].split(".")[0].substring(0, 3);
        }
        // Now with the cases out of the way, we can update the user
        for (let key in update) {
            if (key == "flags" || Array.isArray(user[key]) || key == "joined" || key == "verification") {
                console.log(`Attempted to update protected key ${key} - skipping.`)
                continue; // This is mostly a security measure to prevent any escalations or weird changes
            }
            else {
                updatedKeys.push(key);
                user[key] = update[key];
            }
        }
        // Update the user in the database
        // await fastify.db.collection("users").updateOne({id: id}, {$set: user});
        // For now, we will update the user in redis
        await fastify.redis.set(id, JSON.stringify(user));
        return { "status": "OK", "success": updatedKeys};
    });

    done();
}