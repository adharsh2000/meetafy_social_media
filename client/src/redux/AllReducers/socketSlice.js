import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  socket: null,
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocket: (state, action) => {
      // console.log(action.payload);
      state.socket = action.payload?.Socket;
      // return action.payload?.Socket
    },
  },
});

export default socketSlice.reducer;
export const { setSocket } = socketSlice.actions;

