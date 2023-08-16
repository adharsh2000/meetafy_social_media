import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  posts: [],
  result: 9,
  page: 2,
  firstLoad: false
};

const discoverSlice = createSlice({
  name: 'discover',
  initialState,
  reducers: {
    setLoadingDiscover: (state, action) => {
      state.loading = action.payload;
    },
    getPostsDiscover: (state, action) => {
      state.posts = action.payload.posts;
      state.result = action.payload.result;
      state.firstLoad = true;
    },
    updatePostDiscover: (state, action) => {
      state.posts = action.payload.posts;
      state.result = action.payload.result;
      state.page = state.page + 1;
    },
  },
});

export const { setLoadingDiscover, getPostsDiscover, updatePostDiscover } = discoverSlice.actions;

export default discoverSlice.reducer;
