// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { DeletedChats, NewChat, UpdatedChat } from "@/types/chats";
import { prisma } from "@/util/prisma";
import { UserIdAndFriendId } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession( req , res , authOptions);
  if(!session) return res.status(401).send("Unauthorized");

  const method = req.method;
  if(method === "POST") {
    const { message , friendId , userId , replyId , forwardChats , forwardFriendIds } = req.body as NewChat;
    const isValid = message && friendId && userId && replyId !== undefined && forwardChats !== undefined && forwardFriendIds !== undefined;
    if(!isValid) return res.status(400).send("Bad request");
    if(forwardChats.length) {
      const forwardUserIdAndFriendIds = await prisma.userIdAndFriendId.findMany({ where : { AND : { userId , friendId : { in : forwardFriendIds }} }})
      const userIdAndFriendIds = await prisma.userIdAndFriendId.findMany({ where : { OR : [ { userId } , { friendId : userId } ] }});

      const newForwardChats = await prisma.$transaction(
        forwardUserIdAndFriendIds.flatMap(item => 
          forwardChats.map(chat => {
            const forwardFriendId = (userIdAndFriendIds.find(userIdAndFriendId => userIdAndFriendId.id === chat.userAndFriendRelationId) as UserIdAndFriendId).userId;
            return prisma.chats.create({ data : { message : chat.message , seen : false , userAndFriendRelationId : item.id , forwardFriendId }})
          })
        )
      )
      return res.status(200).json({newForwardChats});
      
    } else {
      const exitUserIdAndFriendId = await prisma.userIdAndFriendId.findFirst({ where : { AND : { userId , friendId }}});
      if(exitUserIdAndFriendId) {
          const newChat = await prisma.chats.create({ data : { message , seen : false , userAndFriendRelationId : exitUserIdAndFriendId.id , replyId }})
          return res.status(200).json({ newChat })
      } else {
          const newUserIdAndFriendId = await prisma.userIdAndFriendId.create({ data : { userId , friendId }});
          if(userId !== friendId) {
            const newUserIdAndFriendIdForFriend = await prisma.userIdAndFriendId.create({ data : { userId : friendId , friendId : userId }})
            const newChat = await prisma.chats.create({ data : { message , seen : false , userAndFriendRelationId : newUserIdAndFriendId.id , replyId }});
            return res.status(200).json({ newChat , newRelations : [newUserIdAndFriendId , newUserIdAndFriendIdForFriend] });
          } else {
            const newChat = await prisma.chats.create({ data : { message , seen : false , userAndFriendRelationId : newUserIdAndFriendId.id , replyId }});
            return res.status(200).json({ newChat , newRelations : [ newUserIdAndFriendId ] });
          }

      }
    }
  } else if ( method === "PUT") {
    const { id , message , isPin } = req.body as UpdatedChat;
    const isValid = id && message && isPin !== undefined;
    if(!isValid) return res.status(400).send("Bad request");
    const exit = await prisma.chats.findUnique({ where : { id }});
    if(!exit) return res.status(400).send("Bad request");
    if(exit.message === message ) {
      const chat = await prisma.chats.update({ where : { id } , data : { isPin , updatedAt : exit.updatedAt }});
      return res.status(200).json({ chat });
    } else {
      const chat = await prisma.chats.update({ where : { id } , data : { message }});
      return res.status(200).json({ chat });
    }
  } else if ( method === "DELETE" ) {
    const { deletedIds } = req.body as DeletedChats;
    if(deletedIds === undefined || !deletedIds.length ) return res.status(400).send("Bad request");
    const exit = await prisma.chats.findMany({ where : { id : { in : deletedIds } }});
    if(!exit.length) return res.status(400).send("Bad request");
    await prisma.chats.deleteMany({ where : { id : { in : deletedIds } }});
    const relation = await prisma.userIdAndFriendId.findFirst({ where : { id : exit[0].userAndFriendRelationId }}) as UserIdAndFriendId;
    const secondRelation = await prisma.userIdAndFriendId.findFirst({ where : { userId : relation.friendId , friendId : relation.userId }}) as UserIdAndFriendId;
    const relationIds = [ relation.id , secondRelation.id ];
    const nonDuplicatedRelationIds = [...new Set(relationIds)];
    const otherChats = await prisma.chats.findMany({ where : { userAndFriendRelationId : { in : nonDuplicatedRelationIds } }});
    if(otherChats.length) {
      return res.status(200).json( { deletedChats : exit })
    } else {
      const deletedUserIdAndFriendIds = await prisma.$transaction(
        nonDuplicatedRelationIds.map(item => prisma.userIdAndFriendId.delete({ where : { id : item }}))
      )
      return res.status(200).json({ deletedChats : exit , deletedUserIdAndFriendIds });
    }
  }
}
