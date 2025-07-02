import { Chats } from "@prisma/client";
import { SuccessOrFailType } from "./user";

export interface NewChat extends SuccessOrFailType {
    message : string,
    userId : number,
    friendId : number,
    replyId : number | null;
    forwardFriendIds : number[];
    forwardChats : Chats[]
}

export interface UpdatedChat extends SuccessOrFailType , Chats {};

export interface ConfirmationItemsType {
    open : boolean,
    chatsToDelete ?: Chats[],
    chatToPin    ?: Chats
} 

export interface DeletedChats extends SuccessOrFailType {
    deletedIds : number[],
};

export interface ChatMenuType {
    chat : Chats | null,
    anchorEl : null | HTMLElement,
}

export interface ForwardItemsType {
    open : boolean;
    forwardChats ?: Chats[];
}