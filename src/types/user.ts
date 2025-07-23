import { Chats, User, UserIdAndFriendId } from "@prisma/client";

export interface CreateUserType extends SuccessOrFailType {
    email : string;
    fromLayout ?: boolean
}

export interface SuccessOrFailType {
    isSuccess ?: (value ?: unknown) => void;
    isFail ?: (value ?: unknown) => void;
}

export interface FriendAndChatAndRelationType {
    friend : User;
    chat : Chats;
    userIdAndFriendId : UserIdAndFriendId
}

export interface UpdatedUserType extends SuccessOrFailType , User {}