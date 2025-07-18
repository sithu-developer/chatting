import { DeletedChats, NewChat, UpdatedChat } from "@/types/chats";
import { envValues } from "@/util/envValues";
import { Chats } from "@prisma/client";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addUserIdAndFriendIds , removeUserIdAndFriendIds } from "./userIdAndFriendIdSlice";

interface ChatsInitialState {
    chats : Chats[],
    error : Error | null
}

const initialState : ChatsInitialState = {
    chats : [] ,
    error : null
}

export const createChat = createAsyncThunk("chatsSlice/createChat" , async ( newChat : NewChat , thunkApi ) => {
    const { message , friendId ,userId , replyId , forwardFriendIds , forwardChats , isFail , isSuccess } = newChat;
    try {
        const response = await fetch(`${envValues.apiUrl}/chats` , {
            method : "POST",
            headers : {
                "Content-type" : "application/json"
            },
            body : JSON.stringify({ message , friendId , userId , replyId , forwardFriendIds , forwardChats })
        });
        const { newChat , newRelations , newForwardChats } = await response.json();
        newChat && thunkApi.dispatch(addChat(newChat));
        if(newRelations) {
            thunkApi.dispatch(addUserIdAndFriendIds(newRelations));
        }
        newForwardChats && thunkApi.dispatch(addForwardChats(newForwardChats))
        isSuccess && isSuccess();
    } catch (err) {
        isFail && isFail();
    }
})

export const updateChat = createAsyncThunk("chatsSlice/updateChat" , async( editedChat : UpdatedChat , thunkApi ) => {
    const { id , message , isPin , seenChatsIds , isFail , isSuccess } = editedChat;
    try {
        const response = await fetch(`${envValues.apiUrl}/chats` , {
            method : "PUT" ,
            headers : {
                "Content-type" : "application/json"
            },
            body : JSON.stringify({ id , message , isPin , seenChatsIds })
        });
        const { chat , seenChats } = await response.json();
        if(isSuccess) {
            isSuccess();
        }
        if(chat) {
            thunkApi.dispatch(replaceChat(chat));
        }
        if(seenChats.length) {
            thunkApi.dispatch(replaceSeenChats(seenChats))
        }
    } catch(err) {
        isFail && isFail();
    }

})

export const deleteChat = createAsyncThunk("chatsSlice/deleteChat" , async( deleteChats : DeletedChats , thunkApi ) => {
    const { deletedIds , isSuccess , isFail } = deleteChats;
    try {
        const response = await fetch(`${envValues.apiUrl}/chats` , {
            method : "DELETE" , 
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ deletedIds })
        });
        const { deletedChats , deletedUserIdAndFriendIds } = await response.json();
        thunkApi.dispatch(removeChats(deletedChats));
        if(deletedUserIdAndFriendIds)  {
            thunkApi.dispatch(removeUserIdAndFriendIds(deletedUserIdAndFriendIds));
        }
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
        removeChats : ( state , action : PayloadAction<Chats[]> ) => {
            const deletedIds = action.payload.map(item => item.id);
            state.chats = state.chats.filter(chat => !deletedIds.includes(chat.id) );
        },
        addForwardChats : ( state , action : PayloadAction<Chats[]>) => {
            state.chats = [...state.chats , ...action.payload ];
        },
        replaceSeenChats : ( state , action : PayloadAction<Chats[]>) => {
            const seenChatsIds = action.payload.map(item => item.id);
            const oldChats = state.chats.filter(item => !seenChatsIds.includes(item.id) )
            state.chats = [...oldChats , ...action.payload];
        }
    }
});

export const { setChats , addChat , replaceChat , removeChats , addForwardChats , replaceSeenChats } = chatSlice.actions;

export default chatSlice.reducer;