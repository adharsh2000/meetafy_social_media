import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    peerUser: null
}

const peerSlice = createSlice({
  name: 'peer',
  initialState,
  reducers: {
    peerUser: (state, action) => {
        state.peerUser = action.payload;
    }
  },
});

export default peerSlice.reducer;
export const { peerUser } = peerSlice.actions;
