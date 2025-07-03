import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { UpdateIsPinChatsItems } from "@/types/userIdAndFriendId";
import { prisma } from "@/util/prisma";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req , res , authOptions);
  if(!session) return res.status(401).send("unauthorized");

  const method = req.method;
  if(method === "PUT") {
    const { allPinValue , selectedRelationIds } = req.body as UpdateIsPinChatsItems;
    const valid = selectedRelationIds !== undefined && selectedRelationIds.length && allPinValue !== undefined;
    if(!valid) return res.status(400).send("Bad request");
    const updatedUserIdAndFriendIds = await prisma.$transaction(
      selectedRelationIds.map(item => prisma.userIdAndFriendId.update({ where : { id : item } , data : { isPinChat : allPinValue }}))
    );
    return res.status(200).json({ updatedUserIdAndFriendIds })
  }
}
