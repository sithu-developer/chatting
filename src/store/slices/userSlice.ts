import { CreateUserType } from "@/types/user";
import { envValues } from "@/util/envValues";
import { User } from "@prisma/client";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserSliceInitailStateType {
    user : User | null
    isLoading : boolean
    error : Error | null
}

const initialState : UserSliceInitailStateType = {
    user : null,
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
        const { user } = await response.json();
        thunkApi.dispatch(setUser(user));
        isSuccess && isSuccess();
    } catch( error ) {
        isFail && isFail
    }
})

export const userSlice = createSlice({
    name : "userSlice" , 
    initialState ,
    reducers : {
        setUser : ( state , action : PayloadAction<User> ) => {
            state.user = action.payload;
        }
    }
})

export const { setUser } = userSlice.actions;

export default userSlice.reducer;