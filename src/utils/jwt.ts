import jwt from "jsonwebtoken";
import redisClient from "../DB/redisClient";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;

export const generateJwtToken=async(userId:String)=>{
    const token = jwt.sign({id:userId},JWT_SECRET_KEY,{expiresIn:'1h'});
    await redisClient.set(token,'valid',{
        EX:3600
    })
    return token;
}

export const verifyJwtToken = async(token:string)=>{
    return jwt.verify(token,JWT_SECRET_KEY);
}

export const invalidateJwtToken=async(token:any):Promise<any>=>{
   return await redisClient.del(token);
}
