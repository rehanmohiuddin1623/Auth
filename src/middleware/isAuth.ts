import { Request, Response } from "express";

export const isAuth = (req: any, res: Response, next: any) => {
    try {
        //@ts-ignore
        const sess = req.session;
        if (sess.email && sess.password) {
             next()
        }
        else {
            res.send({
                message: "Invalid Cookie"
            })
        }
    }
    catch (e) {
        res.send({
            message: "Something Went Wrong"
        })
    }
}