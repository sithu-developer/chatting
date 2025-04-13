import { SuccessOrFailType } from "./user";

export interface NewChat extends SuccessOrFailType {
    chat : string,
    userId : number,
    friendId : number,
    replyId ?: number
}