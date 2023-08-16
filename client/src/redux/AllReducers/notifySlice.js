import { createSlice } from '@reduxjs/toolkit';
import {EditData} from "../../utils/helper"

const initialState = {
  loading: false,
  data: [],
  sound: false,
};

const notifySlice = createSlice({
  name: 'notify',
  initialState,
  reducers: {
    getNotifies: (state, action) => {
      state.data = action.payload;
    },
    createNotify: (state, action) => {
      state.data.unshift(action.payload);
    },
    removeNotify: (state, action) => {
      state.data = state.data.filter((item) => item.id !== action.payload.id || item.url !== action.payload.url);
    },
    updateNotify: (state, action) => {
      state.data = EditData(state.data, action.payload._id, action.payload);
    },
    updateSound: (state, action) => {
      state.sound = action.payload;
    },
    deleteAllNotifies: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { getNotifies, createNotify, removeNotify, updateNotify, updateSound, deleteAllNotifies } = notifySlice.actions;
export default notifySlice.reducer;
