import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
};

const loadingReducer = createSlice({
  name: "load",
  initialState,
  reducers: {
    setLoad: (state, action) => {
      state.loading = true;
    },
    clearLoad: (state) => {
      state.loading = false;
    },
  },
});

export const { setLoad, clearLoad } = loadingReducer.actions;
export default loadingReducer.reducer;
