import { CreateUserType, UpdatedUserType } from "@/types/user";
import { envValues } from "@/util/envValues";
import { User } from "@prisma/client";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setUserIdAndFriendIds } from "./userIdAndFriendIdSlice";
import { setChats } from "./chatsSlice";

interface UserSliceInitailStateType {
    user : User | null
    friends : User[]
    error : Error | null
}

const initialState : UserSliceInitailStateType = {
    user : null,
    friends : [],
    error : null
}

export const createUser = createAsyncThunk("userSlice/createUser" , async( user : CreateUserType , thunkApi) => {
    const { email , isFail , isSuccess } = user;
    try {
        const response = await fetch(`${envValues.apiUrl}/user` , {
            method : "POST" ,
            headers : {
               "Content-Type" : "application/json"
            },
            body : JSON.stringify( { email })
        });
        const { user , friends , userIdAndFriendIds , chats  } = await response.json();
        thunkApi.dispatch(setUser(user));
        thunkApi.dispatch(setFriends(friends));
        thunkApi.dispatch(setUserIdAndFriendIds(userIdAndFriendIds));
        thunkApi.dispatch(setChats( chats ));
        isSuccess && isSuccess();
    } catch( error ) {
        isFail && isFail
    }
})

export const updateUser = createAsyncThunk("userSlice/updateUser" , async( updatedUser : UpdatedUserType , thunkApi ) => {
    const { id , firstName , lastName , bio , day , month , year , isOnline , isSuccess , isFail } = updatedUser;
    try {
        const response = await fetch( `${envValues.apiUrl}/user` , {
            method : "PUT" ,
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ id , firstName , lastName , bio , day , month , year , isOnline })
        });
        const { user } = await response.json();
        thunkApi.dispatch(setUser(user));
        isSuccess && isSuccess();
    } catch( err ) {
        isFail && isFail();
    }
})

export const userSlice = createSlice({
    name : "userSlice" , 
    initialState ,
    reducers : {
        setUser : ( state , action : PayloadAction<User> ) => {
            state.user = action.payload;
        },
        setFriends : ( state , action : PayloadAction<User[]> ) => {
            state.friends = action.payload;
        }
    }
})

export const { setUser , setFriends } = userSlice.actions;

export default userSlice.reducer;