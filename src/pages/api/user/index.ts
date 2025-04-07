// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { CreateUserType } from "@/types/user";
import { prisma } from "@/util/prisma";
import { User } from "@prisma/client";


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
                const user = await prisma.user.create({ data : { email , firstName : "Default" , lastName : "name" , bio : "" , day : 1 , month : 1 , year : 2000 }});
                return res.status(200).json({ user , userProfiles : [] });
            }
        } else if ( method === "PUT") {
            const { id , firstName , lastName , bio , day , month , year } = req.body as User;
            const isValid = id && ( firstName || lastName ) && (bio !== undefined) && day && month && year;
            if(!isValid) return res.status(400).send("Bad request");
            const exit = await prisma.user.findUnique({ where : { id } });
            if(!exit) return res.status(400).send("Bad request");
            const user = await prisma.user.update({ where : { id } , data : { firstName , lastName , bio , day , month , year }});
            return res.status(200).json({ user });
        }
        
    } else {
        res.status(401).send("unauthorized");
    }
}
