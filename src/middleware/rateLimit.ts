import { Response } from "express";
import { redisStore } from "../../session";

export const rateLimiter = async (req: any, res: Response, next: any) => {
    try {
        const ipAddr = req.ip
        const val = await redisStore.client.get(ipAddr) as unknown
        console.log("val", typeof ipAddr, val)
        if (val && typeof val === "string") {
            if (Number(val) > 10) {
                return res.status(429).send("Too Many Requests")
            }
            else {
                await redisStore.client.set(ipAddr, `${Number(val) + 1}`)
            }
        }
        if (!val) {
            console.log("val", ipAddr, val)
            await redisStore.client.set(ipAddr, "1")
        }
        next()
    }
    catch (e) {
        res.send({
            message: "Something Went Wrong"
        })
    }
}