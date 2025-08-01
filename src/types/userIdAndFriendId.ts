import { SuccessOrFailType } from "./user";

export interface UpdateIsPinChatsItems extends SuccessOrFailType {
    selectedRelationIds : number[];
    allPinValue : boolean
}

export interface DeletedRelations extends SuccessOrFailType {
    deletedRelationIds : number[]
}