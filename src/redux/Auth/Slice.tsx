import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";


interface initialValue{
    loading:boolean;
    error: string|null;
    getUser : string |null;
}
const initialState:initialValue = {
    loading:false,
    error:null,
    getUser:null,
}

export const loginUser = createAsyncThunk("Auth/loginUser", async(data: {username: string ; password: string},{rejectWithValue})=>{
    try {
        const response = await axiosInstance.post("/users/login",data);
        if(!response.data.success){
            return rejectWithValue(response.data.message)
        }
        localStorage.setItem("accessToken",response.data.data.accessToken);
        return response.data;
    } catch (error:any) {
        return rejectWithValue(error.response.data.message);
    }
})  

export const Signup =  createAsyncThunk("Auth/signup", async(data :{username:string ; email:string ; password:string}, {rejectWithValue}) => {
    try {
        const response = await axiosInstance.post("/users/register",data);
        if(!response.data.success){
            return rejectWithValue(response.data.message)
        }
        return response.data;
    } catch (error:any) {
        return rejectWithValue(error.response.data.message);
    }
})

const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(loginUser.pending,(state)=>{
            state.loading = true;
            state.error =null;
        })
        .addCase(loginUser.fulfilled,(state,action) => {
            state.loading = false;
            state.error = null;
            state.getUser=action.payload.data;
        })
        .addCase(loginUser.rejected,(state)=>{
            state.loading = true;
            state.error= null;
        })
        
        .addCase(Signup.pending,(state)=>{
            state.loading = true;
            state.error =null;
        })
        .addCase(Signup.fulfilled,(state,action) => {
            state.loading = false;
            state.error = null;
            state.getUser=action.payload.data;
        })
        .addCase(Signup.rejected,(state)=>{
            state.loading = false;
            state.error= null;
        })

    },
    })

export default AuthSlice.reducer;