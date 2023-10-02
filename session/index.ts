import RedisStore from "connect-redis"
import * as redis from 'redis';

const redisClient = redis.createClient(
    {
        username: 'default', // use your Redis user. More info https://redis.io/docs/management/security/acl/
        password: 'secret', // use your password here
        socket: {
            host: 'localhost',
            port: 6379,
            tls: false,
        }
    }
);
const redisStore = new RedisStore({ client: redisClient })

export { redisClient, redisStore }