// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { DeletedChat, NewChat, UpdatedChat } from "@/types/chats";
import { prisma } from "@/util/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession( req , res , authOptions);
  if(!session) return res.status(401).send("Unauthorized");

  const method = req.method;
  if(method === "POST") {
    const { message , friendId , userId , replyId } = req.body as NewChat;
    const isValid = message && friendId && userId && replyId !== undefined ;
    console.log(req.body)
    if(!isValid) return res.status(400).send("Bad request");
    const exitUserIdAndFriendId = await prisma.userIdAndFriendId.findFirst({ where : { AND : { userId , friendId }}});
    if(exitUserIdAndFriendId) {
        const newChat = await prisma.chats.create({ data : { message , seen : false , userAndFriendRelationId : exitUserIdAndFriendId.id , replyId }})
        return res.status(200).json({ newChat })
    } else {
        const newUserIdAndFriendId = await prisma.userIdAndFriendId.create({ data : { userId , friendId }});
        const newChat = await prisma.chats.create({ data : { message , seen : false , userAndFriendRelationId : newUserIdAndFriendId.id , replyId }});
        return res.status(200).json({ newChat , newUserIdAndFriendId });
    }
  } else if ( method === "PUT") {
    const { id , message } = req.body as UpdatedChat;
    const isValid = id && message;
    if(!isValid) return res.status(400).send("Bad request");
    const exit = await prisma.chats.findUnique({ where : { id }});
    if(!exit) return res.status(400).send("Bad request");
    const chat = await prisma.chats.update({ where : { id } , data : { message }});
    return res.status(200).json({ chat });
  } else if ( method === "DELETE" ) {
    const { id } = req.body as DeletedChat;
    if(!id) return res.status(400).send("Bad request");
    const exit = await prisma.chats.findUnique({ where : { id }});
    if(!exit) return res.status(400).send("Bad request");
    const deletedChat = await prisma.chats.delete({ where : { id }});
    const otherChats = await prisma.chats.findMany({ where : { userAndFriendRelationId : deletedChat.userAndFriendRelationId }});
    if(otherChats.length) {
      return res.status(200).json( { deletedChat })
    } else {
      const deletedUserIdAndFriendId = await prisma.userIdAndFriendId.delete({ where : { id : deletedChat.userAndFriendRelationId }});
      return res.status(200).json({ deletedChat , deletedUserIdAndFriendId });
    }
  }
}
