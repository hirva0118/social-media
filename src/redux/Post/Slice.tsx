import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

interface initialValue {
  loading: boolean;
  error: string | null;
  postData: PostData;
  singlePost : Post |null ;
}
const initialState: initialValue = {
  loading: false,
  error: null,
  postData: {
    posts: [],
    serialNumberStartFrom: 0,
    totalPages: 0,
    totalPosts: 0,
    page: 0,
    nextPage: 0,
    hasNextPage: false,
    hasPrevPage: false
  },
  singlePost:null  ,
};
interface CreatePostPayload {
  image: File;
  caption?: string;
}

export const createPost = createAsyncThunk(
  "/Post/createPost",
  async (data: CreatePostPayload, { rejectWithValue }) => {
    try {

      const response = await axiosInstance.post("social-media/posts", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!response.data.success) {
        return rejectWithValue(response.data.message);
      }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getMyPost = createAsyncThunk(
  "/Post/getUserPost",
  async (_, { rejectWithValue }) => {
    try {

      const response = await axiosInstance.get("social-media/posts/get/my", {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!response.data.success) {
        return rejectWithValue(response.data.message);
      }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getSinglePostById = createAsyncThunk(
  "/Post/getSinglePostById",
  async (data:{_id:string}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`social-media/posts/${data._id}`, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!response.data.success) {
        return rejectWithValue(response.data.message);
      }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const likeOnPost = createAsyncThunk(
  "/Post/likeOnPost",
  async (data:{_id:string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`social-media/like/post/${data._id}`);

      if (!response.data.success) {
        return rejectWithValue(response.data.message);
      }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getAllPost = createAsyncThunk(
  "/Post/getAllPost",
  async (data:{page:number}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`social-media/posts/?page=${data.page}`, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!response.data.success) {
        return rejectWithValue(response.data.message);
      }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deletePost = createAsyncThunk(
  "/Post/deletePost",
  async (data:{postId:string}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`social-media/posts/${data.postId}`, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!response.data.success) {
        return rejectWithValue(response.data.message);
      }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
const PostSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        
      })
      .addCase(createPost.rejected, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getMyPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyPost.fulfilled, (state,action) => {
        state.loading = false;
        state.error = null;
        state.postData=action.payload;        
      })
      .addCase(getMyPost.rejected, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getSinglePostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSinglePostById.fulfilled, (state,action) => {
        state.loading = false;
        state.error = null;
        state.singlePost=action.payload;        
      })
      .addCase(getSinglePostById.rejected, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(likeOnPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(likeOnPost.fulfilled, (state) => {
        state.loading = false;
        state.error = null;       
      })
      .addCase(likeOnPost.rejected, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getAllPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPost.fulfilled, (state,action) => {
        state.loading = false;
        state.error = null;
        state.postData=action.payload;        
      })
      .addCase(getAllPost.rejected, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state) => {
        state.loading = false;
        state.error = null;  
             
      })
      .addCase(deletePost.rejected, (state) => {
        state.loading = true;
        state.error = null;
      })
  },
});

export default PostSlice.reducer;
