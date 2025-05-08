import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

interface initialValue {
  loading: boolean;
  error: string | null;
  postData: PostData;
  singlePost: Post | null;
  commentdata: CommentData | null;
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
  singlePost: null,
  commentdata: null,
};

export const addComment = createAsyncThunk(
  "/Post/addComment",
  async (data: { _id: string; content: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `social-media/comments/post/${data._id}`,
        { content: data.content }
      );

      if (!response.data.success) {
        return rejectWithValue(response.data.message);
      }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getComment = createAsyncThunk(
  "/Post/getComment",
  async (data: { _id: string, page:number }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `social-media/comments/post/${data._id}?page=${data.page}`
      );

      if (!response.data.success) {
        return rejectWithValue(response.data.message);
      }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "/Post/deleteComment",
  async (data: { commentId: string}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `social-media/comments/${data.commentId}`
      );

      if (!response.data.success) {
        return rejectWithValue(response.data.message);
      }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const likeUnlikeComment = createAsyncThunk(
  "/Post/likeUnlikeComment",
  async (data: { _id: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `social-media/like/comment/${data._id}`
      );

      if (!response.data.success) {
        return rejectWithValue(response.data.message);
      }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const CommentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addComment.rejected, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getComment.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.commentdata = action.payload;
      })
      .addCase(getComment.rejected, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(likeUnlikeComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(likeUnlikeComment.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(likeUnlikeComment.rejected, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.commentdata = action.payload;
      })
      .addCase(deleteComment.rejected, (state) => {
        state.loading = true;
        state.error = null;
      })
  },
});

export default CommentSlice.reducer;
