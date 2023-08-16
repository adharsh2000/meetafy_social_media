import { createSlice } from "@reduxjs/toolkit"

let initialState = "light"

const mode = localStorage.getItem("preferredMode")
if (mode && (mode === "light" || mode === "dark")) {
  initialState = mode
}

const appearanceSlice = createSlice({
  name: "appearance",
  initialState,
  reducers: {
    changeMode: (state) => (state === "light" ? "dark" : "light"),
    setDarkMode: (state) => "dark",
  },
})

export default appearanceSlice.reducer;

export const { changeMode, setDarkMode } = appearanceSlice.actions;