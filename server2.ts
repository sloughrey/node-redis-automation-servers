import Redis from "ioredis";
import BatchServer from "./batchServer";


const redis = new Redis();
//await redis.connect();

// start the demo
const server = new BatchServer(redis);
server.init();
