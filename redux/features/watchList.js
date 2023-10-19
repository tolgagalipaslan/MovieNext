import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const watchListSlice = createSlice({
  name: "watchList",
  initialState,
  reducers: {
    setData: (state, action) => {
      state.value = action.payload;
    },
    logOut: (state) => {
      state.value = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const { toggle, setData } = watchListSlice.actions;

export default watchListSlice.reducer;
