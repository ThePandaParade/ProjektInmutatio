// My pain and suffering began here, 2024-05-10
// God left us a long time ago.
import fastify from "fastify";
// import { User } from "../types/User";
// import { v4 as uuidv4 } from "uuid";
import { MongoClient } from "mongodb";
import { createClient } from "redis";

// Fastify modules
import fastifyMultipart from "@fastify/multipart";
import fastifyRateLimit from "@fastify/rate-limit";

const app = fastify();

// We also connect to redis and the mongodb database here
const redis = createClient({url: "redis://redis:6379"});
const db = new MongoClient("mongodb://inmutatio:inmutatio@database:8081/inmutatio?authsource=admin");

// Define redis and db within the fastify instance
app.decorate("redis", redis);
app.decorate("db", db);

// Connect to the databases
redis.connect();
//db.connect();
// Until node and docker play nice, we will not connect to the database.

// External routes
import { v1 } from "./v1/v1"
app.register(v1, {prefix: "/v1/"})
app.register(fastifyMultipart);
app.register(fastifyRateLimit, {
    max: 100,
    timeWindow: "1 minute",
});

// Index endpoint
app.get("/", async (req, res) => {
    return { hello: "world" };
});

// Health check endpoint
app.get("/health", async (req, res) => {
    // Check if the databases are connected
    // Ping redis
    let redisStatus = false;
    let dbStatus = false;
    if (await redis.ping() == "PONG") {
        redisStatus = true;
    }
    // Ping mongodb
    // TODO: Ping mongodb
    dbStatus = false;
    
    let statusNo;
    // If all is well, return 200
    // Otherwise, return 417
    if (redisStatus && dbStatus) {
        statusNo = 200;
    } else {
        statusNo = 417;
    }


    await res.status(statusNo).send({
        "status": "OK",
        "redis": redisStatus ? "OK" : "FAIL",
        "mongo": dbStatus ? "OK" : "FAIL"
    }
    )
});

// Start the server
app.listen({port: 7117, host: "::"}, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});