import express from "express"
import session from "express-session"
import RedisStore from "connect-redis"
import bodyParser from "body-parser";
const app = express()
const port = process.env.PORT || 3000;
import { redisClient, redisStore } from "./session"
import { dataBase } from "./db";
import UserRoute from "./src/routes/user"

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const initialize = async () => {
    try {
        await dataBase.initialize()
        await redisClient.connect()
        console.log("PostGres DB & Redis Initialized")
    }
    catch (e) {
        console.log("Error", e)
    }

}


initialize()

redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});

redisClient.on('error', (err: any) => {
    console.error('Redis Error:', err);
});

app.use("/user", UserRoute)

app.get('/', (req: any, res: any) => {
    res.send('Hello World!');
});

app.use(
    session({
        store: redisStore,
        secret: "$reh$ma",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // if true only transmit cookie over https
            httpOnly: false, // if true prevent client side JS from reading the cookie 
            maxAge: 1000 * 60 * 10 // session max age in miliseconds
        }
    })
)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
