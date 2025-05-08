import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

interface initialValue {
    loading:boolean;
    error: string|null;
    userData : UserData |null;
    searchData: SearchData[] | null
    othersProfile : OthersProfile | null;
    following:Following | null;
    followerList : FollowersList|null ;
    followingList : FollowingList | null;
}
const initialState:initialValue = {
    loading:false,
    error:null,
    userData: null ,
    searchData : null,
    othersProfile:null,
    following:null,
    followerList: null,
    followingList:null,
}

interface updateProfilePayload{
    bio:string;
    firstName:string;
    lastName:string;
    phoneNumber:number;
}

export const getProfile = createAsyncThunk("/Profile/getProfile" ,async(_ ,{rejectWithValue}) => {
    try {
        const response= await axiosInstance.get("/social-media/profile");
        if(!response.data.success)
        {
            return response.data.message;
        }
        return response.data.data ;
    } catch (error) {
        return rejectWithValue(error);
    }
})

export const updateProfile = createAsyncThunk("/Profile/updateProfile" , async(data: updateProfilePayload ,{rejectWithValue}) => {
    try {
        const response= await axiosInstance.patch("/social-media/profile",data);
        if(!response.data.success)
            {
                return response.data.message;
            }
            return response.data.data ;
    } catch (error) {
        return rejectWithValue(error);
    }
})
export const updateProfileImage = createAsyncThunk("/Profile/updateProfileImage" , async(data: {coverImage:string|null} ,{rejectWithValue}) => {
    try {
        const response= await axiosInstance.patch("/social-media/profile/cover-image",data);
        if(!response.data.success)
            {
                return response.data.message;
            }
            return response.data.data ;
    } catch (error) {
        return rejectWithValue(error);
    }
})

export const getProfileByUsername = createAsyncThunk("/Profile/getProfileByUsername" , async(data: {username:string} ,{rejectWithValue}) => {
    try {
        const response = await axiosInstance.get(`/social-media/profile/search/?q=${data.username}`);
        if(!response.data.success)
            {
                return response.data.message;
            }
            return response.data.data ;
    } catch (error) {
        return rejectWithValue(error);
    }
})
export const getOthersProfile= createAsyncThunk("/Profile/getOthersProfile",async(data:{username:string},{rejectWithValue}) =>{
    try {
        const response = await axiosInstance.get(`/social-media/profile//u/${data.username}`)
        if(!response.data.success)
            {
                return response.data.message;
            }
            return response.data.data ;
    } catch (error) {
        return rejectWithValue(error);
    }
})

export const toBeFollowed = createAsyncThunk("/Profile/toBeFollowd",async(data:{toBeFollowedUserId:string},{rejectWithValue}) => {
    try {
        const response = await axiosInstance.post(`/social-media/follow/${data.toBeFollowedUserId}`,data)
        if(!response.data.success)
            {
                return response.data.message;
            }
            return response.data.data ;
    } catch (error) {
        return rejectWithValue(error);
    }
})

export const followerList =  createAsyncThunk("/Profile/followerList",async(data:{username:string,page:number},{rejectWithValue})=>{
    try {
        const response = await axiosInstance.get(`social-media/follow/list/followers/${data.username}?page=${data.page}`)
        
        if(!response.data.success)
            {
                return response.data.message;
            }
            return response.data.data ;
    } catch (error:any) {
        return rejectWithValue(error.message);
    }
})
export const followingList =  createAsyncThunk("/Profile/followingList",async(data:{username:string,page:number},{rejectWithValue})=>{
    try {
        const response = await axiosInstance.get(`social-media/follow/list/following/${data.username}?page=${data.page}`)       
        if(!response.data.success)
            {
                return response.data.message;
            }
            return response.data.data ;
    } catch (error:any) {
        return rejectWithValue(error.message);
    }
})

const ProfileSlice = createSlice({
    name: "profile",
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder
            .addCase(getProfile.pending,(state)=>{
                state.loading = true;
                state.error =null;
            })
            .addCase(getProfile.fulfilled,(state,action) => {
                state.loading = false;
                state.error = null;
                state.userData=action.payload;
            })
            .addCase(getProfile.rejected,(state)=>{
                state.loading = true;
                state.error= null;
            })

            .addCase(updateProfile.pending,(state)=>{
                state.loading = true;
                state.error =null;
            })
            .addCase(updateProfile.fulfilled,(state,action) => {
                state.loading = false;
                state.error = null;
                state.userData = action.payload;
            })
            .addCase(updateProfile.rejected,(state)=>{
                state.loading = true;
                state.error= null;
            })

            .addCase(updateProfileImage.pending,(state)=>{
                state.loading = true;
                state.error =null;
            })
            .addCase(updateProfileImage.fulfilled,(state,action) => {
                state.loading = false;
                state.error = null;
                state.userData = action.payload;
            })
            .addCase(updateProfileImage.rejected,(state)=>{
                state.loading = true;
                state.error= null;
            })

            .addCase(getProfileByUsername.pending,(state)=>{
                state.loading = true;
                state.error =null;
            })
            .addCase(getProfileByUsername.fulfilled,(state,action) => {
                state.loading = false;
                state.error = null;
                state.searchData = action.payload;
            })
            .addCase(getProfileByUsername.rejected,(state)=>{
                state.loading = true;
                state.error= null;
            })

            .addCase(getOthersProfile.pending,(state)=>{
                state.loading = true;
                state.error =null;
            })
            .addCase(getOthersProfile.fulfilled,(state,action) => {
                state.loading = false;
                state.error = null;
                state.othersProfile = action.payload;
            })
            .addCase(getOthersProfile.rejected,(state)=>{
                state.loading = true;
                state.error= null;
            })

            .addCase(toBeFollowed.pending,(state)=>{
                state.loading = true;
                state.error =null;
            })
            .addCase(toBeFollowed.fulfilled,(state,action) => {
                state.loading = false;
                state.following=action.payload;
                state.error = null;
            })
            .addCase(toBeFollowed.rejected,(state)=>{
                state.loading = true;
                state.error= null;
            })

            .addCase(followerList.pending,(state)=>{
                state.loading = true;
                state.error =null;
            })
            .addCase(followerList.fulfilled,(state,action) => {
                state.loading = false;
                state.followerList=action.payload;
                state.error = null;
            })
            .addCase(followerList.rejected,(state)=>{
                state.loading = true;
                state.error= null;
            })

            .addCase(followingList.pending,(state)=>{
                state.loading = true;
                state.error =null;
            })
            .addCase(followingList.fulfilled,(state,action) => {
                state.loading = false;
                state.followingList=action.payload;
                state.error = null;
            })
            .addCase(followingList.rejected,(state)=>{
                state.loading = true;
                state.error= null;
            })
        },
})

export default ProfileSlice.reducer;