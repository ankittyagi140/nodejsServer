import { Request, Response } from "express";
import prisma from "../DB/db.config";
import logger from "../logger/winston";

class UsersController {

    static getUser = async (req: Request, res: Response): Promise<any> => {
        try {
            const user = await prisma.users.findMany()
            const userFilterdData = user.map(data => {
                return {
                    id: data.id,
                    name: data.name,
                    email: data.email
                }
            })
            return res.status(200).json({
                data: userFilterdData
            })
        } catch (error:any) {
            logger.error(`Error occurred: ${error.message}`);
            return res.status(500).json({ error: "Something went wrong. Please try again" })
        }
    }

}

export default UsersController;