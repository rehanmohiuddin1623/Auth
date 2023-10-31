import express from "express"
import session from "express-session"
import RedisStore from "connect-redis"
import bodyParser from "body-parser";
const app = express()
const port = process.env.PORT || 3000;
import { redisClient, redisStore } from "./session"
import { dataBase } from "./db";
import UserRoute from "./src/routes/user"
import { isAuth } from "./src/middleware/isAuth";
import { rateLimiter } from "./src/middleware/rateLimit";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('trust proxy', true)

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

redisClient.on('connect', function (err:any) {
    console.log('Connected to redis successfully');
});

redisClient.on('error', (err: any) => {
    console.error('Redis Error:', err);
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
            maxAge: 24 * 60 * 60 * 1000 // session max age in miliseconds
        }
    })
)

app.use("/user", UserRoute)
app.use(isAuth)
app.use(rateLimiter)

app.get('/', async (req: any, res: any) => {
    const sess = req.session;
    console.log("REQ : ", await redisStore.client.get("*"))
    if (sess.email && sess.password) {
        if (sess.email) {
            res.write(`<h1>Welcome ${sess.email} </h1><br>`)
            res.write(
                `<h3>This is the Home page</h3>`
            );
            res.end('<a href=' + '/logout' + '>Click here to log out</a >')
        }
    } else {
        res.send('No Session');
    }

});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
