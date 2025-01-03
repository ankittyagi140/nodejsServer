import { createClient } from "redis";
import logger from "../logger/winston";

const redisClient = createClient();

redisClient.on('error', (err) =>
    logger.error("Error connecting Redis", err));

(async () => {
    await redisClient.connect();
})();

export default redisClient;