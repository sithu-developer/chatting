import { CreateUserType, Status } from "@/types/user";
import { envValues } from "@/util/envValues";
import { User } from "@prisma/client";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setUserProfiles } from "./userProfilesSlice";

interface UserSliceInitailStateType {
    user : User | null
    status : Status
    isLoading : boolean
    error : Error | null
}

const initialState : UserSliceInitailStateType = {
    user : null,
    status : Status.offline,
    isLoading : false,
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
        const { user , userProfiles } = await response.json();
        thunkApi.dispatch(setUser(user));
        thunkApi.dispatch(setUserProfiles(userProfiles));
        isSuccess && isSuccess();
    } catch( error ) {
        isFail && isFail
    }
})

export const userSlice = createSlice({
    name : "userSlice" , 
    initialState ,
    reducers : {
        changeStatus : ( state , action : PayloadAction<Status>) => {
            state.status = action.payload;
        },
        setUser : ( state , action : PayloadAction<User> ) => {
            state.user = action.payload;
        }
    }
})

export const { changeStatus , setUser } = userSlice.actions;

export default userSlice.reducer;