import { Request, Response } from "express";
import { User } from "../entity/user";
import { dataBase } from "../../db";
import bcrypt from "bcrypt"
import { queryValidator } from "../utils/validation";
import mailer from "../../mailer";
import dotenv from "dotenv"
import { handleError } from "../utils/error";
import { redisClient } from "../../session";
import crypto from "crypto";

dotenv.config()

export const register = async (req: Request, res: Response) => {
    try {
        const { firstName, email, lastName, password, confirmPassword, designation } = req.body
        const fields = [firstName, email, lastName, password, confirmPassword, designation]
        const mappedFields = fields.map((field, ind) => (ind === 3 || ind === 4 ? ({ isRequired: true, instance: "string", value: field, comparableVal: field }) : ({ isRequired: true, instance: "string", value: field })))
        const validate = queryValidator({ fields: mappedFields })
        if (!validate) {
            throw new Error("Fields Are Not Valid!")
        }
        const user = await dataBase.manager.findOne(User, { where: { email: email } })
        if (user && user.email === email) {
            throw new Error("Already Registered")
        }
        console.log("User", user)
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const redisKey = crypto.randomBytes(32).toString("hex");
        await redisClient.set(redisKey, JSON.stringify({
            firstName,
            lastName,
            email,
            designation,
            password: hashedPassword
        }), { EX: 60 * 60 })
        await mailer.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "[IMP] Verify Your Email @Medigen",
            sender: "Medigen",
            html: `
            <h3>Hi ${firstName} </h3>
            <a href="http://localhost:3000/user/verify?token=${redisKey}&email=${email}" >Verify</a>
            `
        })
        res.send({
            message: "SingUp SuccessFull Pls Check Your Mail"
        })
    }
    catch (e: unknown) {
        const err = handleError(e)
        res.send({
            error: err
        })
    }
}

export const verifyUser = async (req: Request<null, null | { error: string }, null, { token: string, email: string }>, res: Response) => {
    try {
        const { token, email } = req.query
        const val = await redisClient.get(token)
        const user = await dataBase.getRepository(User).findOne({
            where: { email: email }
        })
        if (user) {
            if (user?.email === email && user.isVerified === true) {
                throw new Error("Email Already Verified")
            }
        }
        if (val && !user) {
            const { firstName, lastName, email, password, designation } = JSON.parse(val ?? {})
            await dataBase.createQueryBuilder().insert().into(User).values([
                { firstName, lastName, email, password, designation, isVerified: true }
            ]).execute()
            await redisClient.del(token)
            res.redirect("https://health-mgmt-ui.vercel.app")
        }
        else {
            throw new Error("Invalid User")
        }
    }
    catch (e: unknown) {
        const err = handleError(e)
        res.send({
            error: err
        })
    }
}