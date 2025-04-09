import { Chats } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatsInitialState {
    chats : Chats[],
    error : Error | null
}

const initialState : ChatsInitialState = {
    chats : [] ,
    error : null
}

const chatSlice = createSlice({
    name : "chatsSlice",
    initialState ,
    reducers : {
        setChats : ( state , action : PayloadAction<Chats[]> ) => {
            state.chats = action.payload;
        }
    }
});

export const { setChats } = chatSlice.actions;

export default chatSlice.reducer;