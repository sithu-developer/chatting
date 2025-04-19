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
        },
        addUserIdAndFriendId : ( state , action : PayloadAction<UserIdAndFriendId> ) => {
            state.userIdAndFriendIds = [...state.userIdAndFriendIds , action.payload ];
        },
        removeUserIdAndFriendId : ( state , action : PayloadAction<UserIdAndFriendId>) => {
            state.userIdAndFriendIds = state.userIdAndFriendIds.filter(item => item.id !== action.payload.id);
        }
    }
})

export const { setUserIdAndFriendIds , addUserIdAndFriendId , removeUserIdAndFriendId } = userIdAndFriendIdSlice.actions;

export default userIdAndFriendIdSlice.reducer;