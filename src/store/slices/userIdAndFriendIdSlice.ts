import { UserIdAndFriendId } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserIdAndFriendIdInitialState {
    userIdAndFriendIds : UserIdAndFriendId[],
    error : Error | null
}

const initialState : UserIdAndFriendIdInitialState = {
    userIdAndFriendIds : [] ,
    error : null
}

const userIdAndFriendIdSlice = createSlice({
    name : "UserIdAndFriendIdSlice" ,
    initialState ,
    reducers : {
        setUserIdAndFriendIds : ( state , action : PayloadAction<UserIdAndFriendId[]> ) => {
            state.userIdAndFriendIds = action.payload;
        }
    }
})

export const { setUserIdAndFriendIds } = userIdAndFriendIdSlice.actions;

export default userIdAndFriendIdSlice.reducer;