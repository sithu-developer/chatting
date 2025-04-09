import { User } from "@prisma/client";

export interface CreateUserType extends SuccessOrFailType {
    email : string
}

export interface SuccessOrFailType {
    isSuccess ?: (value ?: any) => void;
    isFail ?: (value ?: any) => void;
}


export interface UpdatedUserType extends SuccessOrFailType , User {}