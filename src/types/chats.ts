import { Chats } from "@prisma/client";
import { SuccessOrFailType } from "./user";

export interface NewChat extends SuccessOrFailType {
    message : string,
    userId : number,
    friendId : number,
    replyId : number | null;
}

export interface UpdatedChat extends SuccessOrFailType , Chats {};

export interface DeleteConfirmationItemsType {
    open : boolean,
    chatToDelete ?: Chats,
} 

export interface DeletedChat extends SuccessOrFailType {
    id : number,
};

export interface ChatMenuType {
    chat : Chats | null,
    anchorEl : null | HTMLElement,
}