import { v1UserHandler } from "./modules/UserHandler";
export function v1(fastify: any, _: any, done: any) {
    fastify.register(v1UserHandler, {prefix: "/user/"});
    
    fastify.get("/health", async (req: any, res: any) => {
        // Check if the API version is imported
        return { "status": "OK" };
    });

    done();
}