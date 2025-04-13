import { NewChat } from "@/types/chats";
import { envValues } from "@/util/envValues";
import { Chats } from "@prisma/client";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addUserIdAndFriendIds } from "./userIdAndFriendIdSlice";

interface ChatsInitialState {
    chats : Chats[],
    error : Error | null
}

const initialState : ChatsInitialState = {
    chats : [] ,
    error : null
}

export const createChat = createAsyncThunk("chatsSlice/createChat" , async ( newChat : NewChat , thunkApi ) => {
    const { chat , friendId ,userId , replyId , isFail , isSuccess } = newChat;
    try {
        const response = await fetch(`${envValues.apiUrl}/chats` , {
            method : "POST",
            headers : {
                "Content-type" : "application/json"
            },
            body : JSON.stringify({ chat , friendId , userId , replyId })
        });
        const { newChat , newUserIdAndFriendId } = await response.json();
        thunkApi.dispatch(addChat(newChat));
        newUserIdAndFriendId && thunkApi.dispatch(addUserIdAndFriendIds(newUserIdAndFriendId));
        isSuccess && isSuccess();
    } catch (err) {
        isFail && isFail();
    }
})

const chatSlice = createSlice({
    name : "chatsSlice",
    initialState ,
    reducers : {
        setChats : ( state , action : PayloadAction<Chats[]> ) => {
            state.chats = action.payload;
        },
        addChat : ( state , action : PayloadAction<Chats> ) => {
            state.chats = [...state.chats , action.payload ];
        }
    }
});

export const { setChats , addChat } = chatSlice.actions;

export default chatSlice.reducer;