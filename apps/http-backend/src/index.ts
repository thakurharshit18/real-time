import express from "express";
import jwt, { sign } from "jsonwebtoken";
import {createUserSchema,CreateRoomSchema,SigninSchema} from "@repo/common/zod";
import {JWT_SECRET} from "@repo/backend-common/jwt";
import { middleware } from "./middleware.js";
import {prismaclient} from "@repo/db/client";
const app = express();

app.use(express.json());
app.post('/signin',(req,res)=>{
       const data =SigninSchema.safeParse(req.body);
    if(!data.success){
        res.json({
            message:"Incorrect Inputs"
        })
        return;
    }
const userId = 1;
jwt.sign({
    userId
},JWT_SECRET || "");
})

app.post('/signup',async(req,res)=>{
   const ParsedData =createUserSchema.safeParse(req.body);
    if(!ParsedData.success){
        res.json({
            message:"Incorrect Inputs"
        })
        return;
    }

  try {
  const user =   await prismaclient.user.create({
    data:{
        email:ParsedData.data?.username,
        password:ParsedData.data?.password,
        name:ParsedData.data?.name
    }
 })
 return res.json({
    userId:user.id
 })

  } catch (error) {
    res.status(411).json({
        message:"User already exists with this username"
    })
  }


})

app.post('/room',middleware,async(req,res)=>{
   const ParsedData =CreateRoomSchema.safeParse(req.body);
    if(!ParsedData.success){
        res.json({
            message:"Incorrect Inputs"
        })
        return;
    }
    try {
        await prismaclient.room.create

    } catch (error) {
        
    }

})

app.listen(3005);  