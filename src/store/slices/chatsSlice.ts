import { DeletedChat, NewChat, UpdatedChat } from "@/types/chats";
import { envValues } from "@/util/envValues";
import { Chats } from "@prisma/client";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addUserIdAndFriendId, removeUserIdAndFriendId } from "./userIdAndFriendIdSlice";

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
        newUserIdAndFriendId && thunkApi.dispatch(addUserIdAndFriendId(newUserIdAndFriendId));
        isSuccess && isSuccess();
    } catch (err) {
        isFail && isFail();
    }
})

export const updateChat = createAsyncThunk("chatsSlice/updateChat" , async( editedChat : UpdatedChat , thunkApi ) => {
    const { id , message , isPin , isFail , isSuccess } = editedChat;
    try {
        const response = await fetch(`${envValues.apiUrl}/chats` , {
            method : "PUT" ,
            headers : {
                "Content-type" : "application/json"
            },
            body : JSON.stringify({ id , message , isPin })
        });
        const { chat } = await response.json();
        thunkApi.dispatch(replaceChat(chat));
        isSuccess && isSuccess();
    } catch(err) {
        isFail && isFail();
    }

})

export const deleteChat = createAsyncThunk("chatsSlice/deleteChat" , async( deleteChat : DeletedChat , thunkApi ) => {
    const { id , isSuccess , isFail } = deleteChat;
    try {
        const response = await fetch(`${envValues.apiUrl}/chats` , {
            method : "DELETE" , 
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ id })
        });
        const { deletedChat , deletedUserIdAndFriendId } = await response.json();
        thunkApi.dispatch(removeChat(deletedChat));
        deletedUserIdAndFriendId && thunkApi.dispatch(removeUserIdAndFriendId(deletedUserIdAndFriendId));
        isSuccess && isSuccess();
    } catch(err) {
        isFail && isFail();
    }
});

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
        },
        removeChat : ( state , action : PayloadAction<Chats> ) => {
            state.chats = state.chats.filter(chat => chat.id !== action.payload.id);
        }
    }
});

export const { setChats , addChat , replaceChat , removeChat } = chatSlice.actions;

export default chatSlice.reducer;