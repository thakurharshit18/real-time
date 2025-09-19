
import { NextFunction,Request,Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/jwt";
interface jwtPayload{
    userId: number;
}
export function middleware(req:Request,res: Response,next:NextFunction){
    const authHeader = req.headers["authorization"] ?? "";
const token = authHeader && authHeader.split(" ")[1];
if(!token){
    return res.status(401).json({error:"Token missing"});
}
   
try {
    const decoded = jwt.verify(token,JWT_SECRET) as jwtPayload;
    (req as any).userId = decoded.userId;
    next();
} catch (error) {
    res.status(403).json({error:"Invalid or expired token"});
}
}