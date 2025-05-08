import { combineReducers, configureStore } from "@reduxjs/toolkit";
import  AuthSlice  from "./Auth/Slice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import ProfileSlice from "./Profile/Slice";
import PostSlice from "./Post/Slice";
import CommentSlice from "./Comment/Slice";
import BookmarkSlice from "./Bookmark/Slice"

const rootReducer = combineReducers({
    auth:AuthSlice,
    profile:ProfileSlice,
    post:PostSlice,
    comment : CommentSlice,
    bookmark : BookmarkSlice
})
export const store = configureStore({
    reducer: rootReducer,
  });


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;