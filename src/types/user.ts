import { Chats, User } from "@prisma/client";

export interface CreateUserType extends SuccessOrFailType {
    email : string;
    fromLayout ?: boolean
}

export interface SuccessOrFailType {
    isSuccess ?: (value ?: any) => void;
    isFail ?: (value ?: any) => void;
}

export interface FriendAndChatType {
    friend : User;
    chat : Chats;
}

export interface UpdatedUserType extends SuccessOrFailType , User {}