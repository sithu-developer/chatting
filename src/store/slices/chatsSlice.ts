import { NewChat, UpdatedChat } from "@/types/chats";
import { envValues } from "@/util/envValues";
import { Chats } from "@prisma/client";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addUserIdAndFriendIds } from "./userIdAndFriendIdSlice";
import { SuccessOrFailType } from "@/types/user";

interface ChatsInitialState {
    chats : Chats[],
    error : Error | null
}

const initialState : ChatsInitialState = {
    chats : [] ,
    error : null
}

export const createChat = createAsyncThunk("chatsSlice/createChat" , async ( newChat : NewChat , thunkApi ) => {
    const { message , friendId ,userId , replyId , isFail , isSuccess } = newChat;
    try {
        const response = await fetch(`${envValues.apiUrl}/chats` , {
            method : "POST",
            headers : {
                "Content-type" : "application/json"
            },
            body : JSON.stringify({ message , friendId , userId , replyId })
        });
        const { newChat , newUserIdAndFriendId } = await response.json();
        thunkApi.dispatch(addChat(newChat));
        newUserIdAndFriendId && thunkApi.dispatch(addUserIdAndFriendIds(newUserIdAndFriendId));
        isSuccess && isSuccess();
    } catch (err) {
        isFail && isFail();
    }
})

export const updateChat = createAsyncThunk("chatsSlice/updateChat" , async( editedChat : UpdatedChat , thunkApi ) => {
    const { id , message , isFail , isSuccess } = editedChat;
    try {
        const response = await fetch(`${envValues.apiUrl}/chats` , {
            method : "PUT" ,
            headers : {
                "Content-type" : "application/json"
            },
            body : JSON.stringify({ id , message })
        });
        const { chat } = await response.json();
        thunkApi.dispatch(replaceChat(chat));
        isSuccess && isSuccess();
    } catch(err) {
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
        },
        replaceChat : ( state , action : PayloadAction<Chats> ) => {
            state.chats = state.chats.map(chat => chat.id === action.payload.id ? action.payload : chat);
        }
    }
});

export const { setChats , addChat , replaceChat } = chatSlice.actions;

export default chatSlice.reducer;