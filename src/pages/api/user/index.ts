// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { CreateUserType } from "@/types/user";
import { prisma } from "@/util/prisma";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    const session = await getServerSession(req, res, authOptions);
    
    if(session) {
        const method = req.method;
        if(method === "POST") {
            const { email } = req.body as CreateUserType; 
            if(!email) return res.status(400).send("Bad request");
            const exit = await prisma.user.findUnique({where : { email }});
            if(exit) {
                const userProfiles = await prisma.userProfiles.findMany({ where : { userId : exit.id }})
                return res.status(200).json({ user : exit , userProfiles })
            } else {
                const user = await prisma.user.create({ data : { email , name : "Default Name" }});
                return res.status(200).json({ user , userProfiles : [] });
            }
        }
        
    } else {
        res.status(401).send("unauthorized");
    }
}
