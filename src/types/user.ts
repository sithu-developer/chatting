export interface CreateUserType extends SuccessOrFailType {
    email : string
}

export interface SuccessOrFailType {
    isSuccess ?: (value ?: any) => void;
    isFail ?: (value ?: any) => void;
}

export enum Status {
    online = "online" ,
    offline = "offline"
}