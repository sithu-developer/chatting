import { Chats } from "@prisma/client";
import { SuccessOrFailType } from "./user";

export interface NewChat extends SuccessOrFailType {
    chat : string,
    userId : number,
    friendId : number,
    replyId : number | null;
}

export interface ChatMenuType {
    chat : Chats | null,
    anchorEl : null | HTMLElement,
}