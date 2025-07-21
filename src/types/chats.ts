import { Chats, UserIdAndFriendId } from "@prisma/client";
import { SuccessOrFailType } from "./user";

export interface NewChat extends SuccessOrFailType {
    message : string,
    imageMessageUrl ?: string
    userId : number,
    friendId : number,
    replyId : number | null;
    forwardFriendIds : number[];
    forwardChats : Chats[]
}

export interface UpdatedChat extends SuccessOrFailType {
    id : number;
    message : string;
    imageMessageUrl ?: string | null;
    isPin : boolean;
    seenChatsIds ?: number[]
};

export interface ConfirmationItemsType {
    open : boolean,
    chatsToDelete ?: Chats[],
    chatToPin    ?: Chats,
    relationsToDelete ?: UserIdAndFriendId[]
} 

export interface DeletedChats extends SuccessOrFailType {
    deletedIds : number[],
};

export interface MessageMenuType {
    chat : Chats | null,
    anchorEl : null | HTMLElement,
}

export interface ForwardItemsType {
    open : boolean;
    forwardChats ?: Chats[];
}