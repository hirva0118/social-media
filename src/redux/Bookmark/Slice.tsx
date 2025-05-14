import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

interface initialValue {
  loading: boolean;
  error: string | null;
  postData: PostData;
  singlePost: Post | null;
  commentdata: CommentData | null;
  bookmarkData : BookmarkData | null;
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
  bookmarkData:null,
};

export const addRemoveBookmark = createAsyncThunk(
  "/Bookmark/addRemoveBookmark",
  async (data: { _id: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `social-media/bookmarks/${data._id}`
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
export const getBookmark = createAsyncThunk(
    "/Bookmark/getBookmark",
    async (_, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get(
          "social-media/bookmarks"
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

const BookmarkSlice = createSlice({
  name: "bookmark",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addRemoveBookmark.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRemoveBookmark.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addRemoveBookmark.rejected, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getBookmark.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookmark.fulfilled, (state,action) => {
        state.loading = false;
        state.error = null;
        state.bookmarkData=action.payload;
      })
      .addCase(getBookmark.rejected, (state) => {
        state.loading = true;
        state.error = null;
      });

  }
});

export default BookmarkSlice.reducer;
