"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
 const router = useRouter();
  const [roomId ,setRoomId] =useState("");
  return (
   <div>
<input value = {roomId} onChange={(e)=>{setRoomId(e.target.value)}}
type="text" placeholder="Room id"
/>
  <button onClick={()=>{
    router.push('/room/${roomId}');
  }}>Join Room </button>
   </div>
  );
}
