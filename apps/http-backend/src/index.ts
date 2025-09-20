import express from "express";
import jwt, { sign } from "jsonwebtoken";
import {createUserSchema,CreateRoomSchema,SigninSchema} from "@repo/common/zod";
import {JWT_SECRET} from "@repo/backend-common/jwt";
import { middleware } from "./middleware.js";
import {prismaclient} from "@repo/db/client";
import bcrypt from "bcrypt";
const app = express();

app.use(express.json());
app.post('/signin',async(req,res)=>{
       const ParsedData =SigninSchema.safeParse(req.body);
    if(!ParsedData.success){
        res.json({
            message:"Incorrect Inputs"
        })
        return;
    }
try {
 const user =  await prismaclient.user.findUnique({
    where:{
        email:ParsedData.data.username
    }
})
if(!user){
    return res.status(401).json({message:"User does not exist"});
}
const isPasswordValid = await bcrypt.compare(ParsedData.data.password,user.password);
if(!isPasswordValid){
    return res.status(401).json({
        message:"Invalid Credentials"
    })
}

const token = jwt.sign({userId:user?.id},JWT_SECRET);
res.json({
    token
});

} catch (error) {
    return res.json({message:"Internal server error"});
}
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
    const hashedPassword = await bcrypt.hash(ParsedData.data.password,10);
  const user =   await prismaclient.user.create({
    data:{
        email:ParsedData.data?.username,
        password:hashedPassword,
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
   
   const ParsedData = CreateRoomSchema.safeParse(req.body);
   if(!ParsedData.success){
    res.json({
        message:"Incorrect Inputs"
    })
    return;
   }

    try {
    //@ts-ignore
        const userID = req.userId;
        if(!userID){
            return res.json({
                message:"unauthorized"
            })
        }
       const room =  await prismaclient.room.create({
        data:{
        slug:ParsedData.data.name,
        adminId:userID
        }
       })
       return res.json({
        roomId:room.id
       })

    } catch (error) {
res.status(401).json({message:"room name already exists"});        
    }
})
app.get('/chats/:roomId',async(req,res)=>{
    const roomId = Number(req.params.roomId);
    const messages = await prismaclient.chat.findMany({
        where:{
            roomId:roomId
        },
        orderBy:{
            id:"desc"
        },
        take:50  
    });
    res.json({
        messages 
    })
})

app.listen(3005);  