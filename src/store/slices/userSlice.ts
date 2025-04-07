import { CreateUserType, Status, UpdatedUserType } from "@/types/user";
import { envValues } from "@/util/envValues";
import { User } from "@prisma/client";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setUserProfiles } from "./userProfilesSlice";
import { changeSnackBar } from "./generalSlice";
import { Severity } from "@/types/general";

interface UserSliceInitailStateType {
    user : User | null
    status : Status
    error : Error | null
}

const initialState : UserSliceInitailStateType = {
    user : null,
    status : Status.offline,
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
        thunkApi.dispatch(changeStatus(Status.online));
        isSuccess && isSuccess();
    } catch( error ) {
        isFail && isFail
    }
})

export const updateUser = createAsyncThunk("userSlice/updateUser" , async( updatedUser : UpdatedUserType , thunkApi ) => {
    const { id , firstName , lastName , bio , day , month , year , isSuccess , isFail } = updatedUser;
    try {
        const response = await fetch( `${envValues.apiUrl}/user` , {
            method : "PUT" ,
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ id , firstName , lastName , bio , day , month , year })
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