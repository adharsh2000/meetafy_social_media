import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  users: []
};

const suggestionsSlice = createSlice({
  name: 'suggestions',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    }
  }
});

export const { setLoading, setUsers } = suggestionsSlice.actions;
export default suggestionsSlice.reducer;