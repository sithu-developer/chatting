import { DeletedRelations, UpdateIsPinChatsItems } from "@/types/userIdAndFriendId";
import { envValues } from "@/util/envValues";
import { UserIdAndFriendId } from "@prisma/client";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { removeChats } from "./chatsSlice";

interface UserIdAndFriendIdInitialState {
    userIdAndFriendIds : UserIdAndFriendId[],
    error : Error | null
}

const initialState : UserIdAndFriendIdInitialState = {
    userIdAndFriendIds : [] ,
    error : null
}

export const updateIsPinChats = createAsyncThunk("UserIdAndFriendIdSlice/updateIsPinChats" , async( updateIsPinChatsItems : UpdateIsPinChatsItems , thunkApi ) => {
    const { allPinValue , selectedRelationIds , isFail , isSuccess } = updateIsPinChatsItems;
    try {
        const response = await fetch(`${envValues.apiUrl}/userIdAndFriendId` , {
            method : "PUT",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ allPinValue , selectedRelationIds })
        });
        const { updatedUserIdAndFriendIds } = await response.json();
        thunkApi.dispatch(updateUserIdAndFriendIds(updatedUserIdAndFriendIds))
        if(isSuccess) {
            isSuccess();
        }
    } catch(err) {
        console.log(err);
        if(isFail) {
            isFail();
        }
    }
})

export const deleteRelations = createAsyncThunk("UserIdAndFriendIdSlice/deleteRelations" , async( deleteItems : DeletedRelations , thunkApi ) => {
    const { deletedRelationIds , isFail , isSuccess } = deleteItems;
    try {
        const response = await fetch(`${envValues.apiUrl}/userIdAndFriendId` , {
            method : "DELETE",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ deletedRelationIds })
        });
        const { deletedChats , deletedUserIdAndFriendIds } = await response.json();
        thunkApi.dispatch(removeChats(deletedChats));
        thunkApi.dispatch(removeUserIdAndFriendIds(deletedUserIdAndFriendIds))
        if(isSuccess) {
            isSuccess();
        }
    } catch(err) {
        console.log(err);
        if(isFail) {
            isFail();
        }
    }
})

const userIdAndFriendIdSlice = createSlice({
    name : "UserIdAndFriendIdSlice" ,
    initialState ,
    reducers : {
        setUserIdAndFriendIds : ( state , action : PayloadAction<UserIdAndFriendId[]> ) => {
            state.userIdAndFriendIds = action.payload;
        },
        addUserIdAndFriendIds : ( state , action : PayloadAction<UserIdAndFriendId[]> ) => {
            state.userIdAndFriendIds = [...state.userIdAndFriendIds , ...action.payload ];
        },
        removeUserIdAndFriendIds : ( state , action : PayloadAction<UserIdAndFriendId[]>) => {
            const relationIds = action.payload.map(item => item.id)
            state.userIdAndFriendIds = state.userIdAndFriendIds.filter(item => !relationIds.includes(item.id));
        },
        updateUserIdAndFriendIds : ( state , action : PayloadAction<UserIdAndFriendId[]> ) => {
            const updatedIds = action.payload.map(item => item.id);
            const filteredItems = state.userIdAndFriendIds.filter(item => !updatedIds.includes(item.id));
            state.userIdAndFriendIds = [...action.payload , ...filteredItems]
        }
    }
})

export const { setUserIdAndFriendIds , addUserIdAndFriendIds , removeUserIdAndFriendIds , updateUserIdAndFriendIds} = userIdAndFriendIdSlice.actions;

export default userIdAndFriendIdSlice.reducer;