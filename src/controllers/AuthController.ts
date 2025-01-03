
import prisma from "../DB/db.config";
import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import { validationResult } from "express-validator";
import { generateJwtToken, invalidateJwtToken, verifyJwtToken } from "../utils/jwt";
import logger from "../logger/winston";

class AuthController {
    static register = async (req: Request, res: Response): Promise<any> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorMessage: string[] = errors.array().map(error => error.msg)
                return res.status(400).json({ errors: errorMessage });
            }
            const payload = req.body;
            console.log(payload)
            const salt = await bcrypt.genSalt(10)
            payload.password = await bcrypt.hash(payload.password, salt)
            //check unique email
            const userEmail = await prisma.users.findUnique({
                where: {
                    email: payload.email
                }
            })
            if (userEmail) {
                return res.status(400).json({ message: "Email already exist. please use some other email" })
            }
            const user = await prisma.users.create({
                data: payload
            })
            if (!user) {
                return res.status(500).json({ error: "Something went wrong. Please try again" })
            }
            return res.json({ status: 200, message: "user registerd success", user })
        } catch (error: any) {
            logger.error(`Error occurred: ${error.message}`);
            return res.status(500).json({ error: "Something went wrong. Please try again" })
        }

    }

    static login = async (req: Request, res: Response): Promise<any> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorMessage: String[] = errors.array().map(error => error.msg)
                return res.status(400).json({ errors: errorMessage })
            }
            const payload = req.body;
            // const salt = await bcrypt.genSalt(10);
            // payload.password = await bcrypt.hash(payload.password,salt);
            const user = await prisma.users.findUnique({
                where: {
                    email: payload.email
                }
            })
            //check if valid user
            if (!user) {
                return res.status(401).json({ error: "Invalid credentials" })
            }
            //verify password
            const verifyPassword = await bcrypt.compare(payload.password, user.password)
            if (!verifyPassword) {
                return res.status(401).json({ error: "Password does not match" })
            }
            const token = await generateJwtToken(payload.name)
            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 1000
            });
            return res.status(200).json({ message: "User login Success", user, token: `Bearer ${token}` })
        } catch (error:any) {
            logger.error(`Error occurred: ${error.message}`);
            return res.status(500).json({ error: "Sonething went wrong. please try again" })
        }
    }

    static logout = async (req: Request, res: Response): Promise<any> => {
        try {
            const token = req.header("Authorization")?.split(' ')[1];
            const user = invalidateJwtToken(token)
            if (!user) {
                return res.status(500).json({ error: "Something went wrong. Please try again" })
            }
            res.status(200).json({ message: "Successfully logout" })
        } catch (error:any) {
            logger.error(`Error occurred: ${error.message}`);
            return res.status(500).json({ error: "Something went wrong. Please try again" })
        }
    }

}

export default AuthController;