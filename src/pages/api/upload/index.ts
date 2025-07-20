// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { put } from "@vercel/blob";

export const config = {
  api: {
    bodyParser: false,
  },
};


export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse,
) {
    const session = await getServerSession(req , res , authOptions);
    if(!session) return res.status(401).send("Unauthorized");
    const method = req.method;
    if(method === "POST") {
        const filename = req.query.filename;
        const blob = await put(`chatting/${filename}` , req , {
            access : "public"
        })
        return res.status(200).json(blob);
    }
}
