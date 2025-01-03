import { Request,Response,NextFunction } from "express";
import { verifyJwtToken } from "../utils/jwt";
import redisClient from "../DB/redisClient";
import logger from "../logger/winston";

export const authenticateJwtToken=async(req:Request,res:Response,next:NextFunction):Promise<any>=>{
    try {
        const token = req.header("Authorization")?.split(' ')[1];
        if(!token){
            return res.sendStatus(403).json({message:"Forbidden"}) // Forbidden
        }
        //verify token on redis
        const jwtTokenExists = await redisClient.get(token);
        if(!jwtTokenExists){
            return res.status(401).json({message:"Unauthorise User"})
        }
        verifyJwtToken(token)
        next();
    } catch (error:any) {
        logger.error(`Error occurred: ${error.message}`);
        return res.status(401).json({message:"Unauthorised User"})
    }
}