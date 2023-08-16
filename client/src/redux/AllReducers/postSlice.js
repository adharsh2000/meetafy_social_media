import {
    createSlice,
    createAsyncThunk 
} from "@reduxjs/toolkit";
import axios from '../../Axios/axiosInstance'

const initialState = {
    loading: false,
    onEdit:false,
    currentPost:[],
    posts: [],
    error: '',
    result: 0,
    page: 2
}

export const loadMorePosts = createAsyncThunk('posts/loadMorePosts', async (limit) => {
    try {
      const response = await axios.get(`/api/post?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw Error(error);
    }
  });

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        createPost: (state, action) => {
            state.posts.unshift(action.payload)
        },
        loadingPost: (state, action) => {
            state.loading = action.payload;
        },
        setOnEdit: (state, action) => {
          state.onEdit = action.payload;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        },
        setCurrentPost: (state, action) => {
          state.currentPost = action.payload;
        },
        setUpdatePost: (state, action) => {
            state.posts = state.posts.map((item) =>
                item._id === action.payload._id ? action.payload : item
            );
        },
        setDeletePost: (state, action) => {
          state.posts = state.posts.filter((item) => item._id !== action.payload._id);
          // Return a new state object to reflect the updated value
          return state;
        },        
        setResetPost: (state) => {
          state.loading = false;
          state.posts = [];
          state.error = "";
          state.result = 0;
          state.page = 2;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadMorePosts.pending, (state) => {
            state.loading = true;
          });
        
          builder.addCase(loadMorePosts.fulfilled, (state, action) => {
            state.loading = false;
            
            const newPosts = action.payload.posts.filter((post) => {
              return !state.posts.find((existingPost) => existingPost._id === post._id);
            });
            
            state.posts = [...state.posts, ...newPosts];
            state.error = "";
            state.result = action.payload.result;
          });
          
        
          builder.addCase(loadMorePosts.rejected, (state, action) => {
            state.loading = false;
            state.posts = []
            state.error = action.error.message
            // Handle the error state here
          });
    }
})


export default postSlice.reducer;
export const { createPost,loadingPost,setUpdatePost,setDeletePost,setPage,setResetPost,setOnEdit,setCurrentPost } = postSlice.actions;