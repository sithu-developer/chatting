import { UserProfiles } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface InitialState {
    userProfiles : UserProfiles[],
    error : Error | null;
}

const initialState : InitialState = {
    userProfiles : [],
    error : null
}

const userProfileSlice = createSlice({
    name : "userProfileSlice" ,
    initialState ,
    reducers : {
        setUserProfiles : ( state , action : PayloadAction<UserProfiles[]> ) => {
            state.userProfiles = action.payload;
        }
    }
})

export const { setUserProfiles } = userProfileSlice.actions;

export default userProfileSlice.reducer;