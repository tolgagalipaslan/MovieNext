import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const favoriteListsSlice = createSlice({
  name: "favoriteList",
  initialState,
  reducers: {
    setDataFav: (state, action) => {
      state.value = action.payload;
    },
    logOutFav: (state) => {
      state.value = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const { logOutFav, setDataFav } = favoriteListsSlice.actions;

export default favoriteListsSlice.reducer;
