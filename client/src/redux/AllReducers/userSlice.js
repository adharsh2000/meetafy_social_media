import { createSlice } from "@reduxjs/toolkit"

const initialState = null

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => action.payload,
    clearUser: (state) => null,
  },
})

export default userSlice.reducer
export const { setUser, clearUser } = userSlice.actions
