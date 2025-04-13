// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { NewChat } from "@/types/chats";
import { prisma } from "@/util/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession( req , res , authOptions);
  if(!session) return res.status(401).send("Unauthorized");

  const method = req.method;
  if(method === "POST") {
    const { chat , friendId , userId } = req.body as NewChat;
    const isValid = chat && friendId && userId;
    if(!isValid) return res.status(400).send("Bad request");
    const exitUserIdAndFriendId = await prisma.userIdAndFriendId.findFirst({ where : { AND : { userId , friendId }}});
    if(exitUserIdAndFriendId) {
        const newChat = await prisma.chats.create({ data : { chat , seen : false , userAndFriendRelationId : exitUserIdAndFriendId.id }})
        return res.status(200).json({ newChat })
    } else {
        const newUserIdAndFriendId = await prisma.userIdAndFriendId.create({ data : { userId , friendId }});
        console.log(newUserIdAndFriendId)
        const newChat = await prisma.chats.create({ data : { chat , seen : false , userAndFriendRelationId : newUserIdAndFriendId.id }});
        return res.status(200).json({ newChat , newUserIdAndFriendId });
    }
  }
}
