
import { createSlice } from "@reduxjs/toolkit"
import { USER_TOKEN } from "../../Constants/Constants"


const initialState = localStorage.getItem(USER_TOKEN) || null

const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state) => localStorage.getItem('user_auth'),
    clearAuth: (state) => null,
  },
})

export default authReducer.reducer
export const { setAuth, clearAuth } = authReducer.actions
