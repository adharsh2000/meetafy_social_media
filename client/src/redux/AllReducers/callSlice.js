import { createSlice } from '@reduxjs/toolkit';

const callSlice = createSlice({
  name: 'call',
  initialState: null,
  reducers: {
    callUser: (state, action) => action.payload,
  },
});

export default callSlice.reducer;
export const { callUser } = callSlice.actions;
