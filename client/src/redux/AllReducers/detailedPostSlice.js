import { createSlice } from "@reduxjs/toolkit";

const initialState = [];
const detailedPostSlice = createSlice({
    name: "detailedPosts",
    initialState,
    reducers: {
        getPost: (state, action) => {
            const existingPost = state.find(post => post._id === action.payload._id);
            if (!existingPost) {
                state.push(action.payload);
            }
        },
        // updateDetailedPost: (state, action) => {
        //     state = state.map((item) =>
        //         item._id === action.payload._id ? action.payload : item
        //     );
        // }
        updateDetailedPost: (state, action) => {
            const { payload } = action;
            const existingPostIndex = state.findIndex(item => item._id === payload._id);
            if (existingPostIndex !== -1) {
                state[existingPostIndex] = payload;
            }
        },
    }
});

export default detailedPostSlice.reducer;
export const { getPost, updateDetailedPost } = detailedPostSlice.actions;