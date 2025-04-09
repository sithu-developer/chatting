import { configureStore } from '@reduxjs/toolkit'
// ...
import userSliceReducer from "./slices/userSlice"
import generalReducer from "./slices/generalSlice"
import userIdAndFriendIdReducer from "./slices/userIdAndFriendIdSlice"
import chatsReducer from "./slices/chatsSlice"

export const store = configureStore({
  reducer: {
    userSlice : userSliceReducer,
    general : generalReducer,
    userIdAndFriendIdSlice : userIdAndFriendIdReducer,
    chatsSlice : chatsReducer,
    
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch