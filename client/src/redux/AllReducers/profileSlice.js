import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../Axios/axiosInstance";

const initialState = {
    loading: false,
    users: [],
    ids: [],
    posts: []
}

// export const fetchUserDetails = createAsyncThunk('profile/userProfileDetails', async (id) => {
//     try {
//         const response = await axios.get(`/api/user/${id}`);
//         console.log(response.data.user);
//         return response.data;
//     } catch (error) {
//         throw Error(error);
//     }
// })

export const fetchUserDetails = createAsyncThunk(
    'profile/userProfileDetails',
    async (id) => {
      try {
        const response = await axios.get(`/api/user/${id}`);
        return response.data.user;
      } catch (error) {
        throw Error(error);
      }
    }
  );

  export const fetchUserProfilePosts = createAsyncThunk(
    'profile/userProfilePosts',
    async (id) => {
      try {
        const response = await axios.get(`/api/user_posts/${id}`);
        const newData = {
          post:response.data.posts,
          _id:id,
          page:2,
          result:response.data.result,
        }
        console.log(newData);
        return newData;
      } catch (error) {
        throw Error(error);
      }
    }
  );
  

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        getUser: (state, action) => {
            state.users.push(action.payload.user);
        },
        follow: (state, action) => {
            state.users = state.users.map((item) =>
                item._id === action.payload._id ? action.payload : item
            );
        },
        // follow: (state, action) => {
        //     state.users = state.users.map((item) =>
        //       item._id === action.payload._id ? { ...item, ...action.payload } : item
        //     );
        // },
        unfollow: (state, action) => {
            state.users = state.users.map((item) =>
                item._id === action.payload._id ? action.payload : item
            );
        },
        getId: (state, action) => {
          const id = action.payload;
          if (!state.ids.includes(id)) {
            state.ids.push(id);
          }
        },        
        getPosts: (state, action) => {
            state.posts.push(action.payload);
        },
        updateProfilePost: (state, action) => {
            state.posts = state.posts.map((item) =>
                item._id === action.payload._id ? action.payload : item 
            );
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUserDetails.pending, (state) => {
          state.loading = true;
        });

        builder.addCase(fetchUserDetails.fulfilled, (state, action) => {
            const newUser = action.payload;
          
            // Check if the user already exists in the users array
            const existingUser = state.users.find(user => user._id === newUser._id);
          
            if (!existingUser) {
              // Append the new user to the users array
              state.users.push(newUser);
            } else {
              // Update the existing user data
              state.users = state.users.map(user =>
                user._id === newUser._id ? newUser : user
              );
            }
          
            state.loading = false;
          });
          
    
        builder.addCase(fetchUserDetails.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        });

        builder.addCase(fetchUserProfilePosts.pending, (state) => {
          state.loading = true;
        });
        
        builder.addCase(fetchUserProfilePosts.fulfilled, (state, action) => {
          const userPosts = action.payload;
          
          const isDuplicate = state.posts.some((post) => post.id === userPosts._id);

          if (!isDuplicate) {
            // Update the user profile posts in the state by adding userPosts
            state.posts = [...state.posts, userPosts];
          }
          
          state.loading = false;
        });
        
        builder.addCase(fetchUserProfilePosts.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        });
        
      },
});

export default profileSlice.reducer;
export const { setLoading, getUser, follow, unfollow, getId, getPosts, updateProfilePost } = profileSlice.actions;
