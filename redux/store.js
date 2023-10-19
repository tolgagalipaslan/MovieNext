import { configureStore } from "@reduxjs/toolkit";
import watchListSlice from "./features/watchList";
import favoriteListSlice from "./features/favorites";

export const store = configureStore({
  reducer: {
    watchList: watchListSlice,
    favoriteList: favoriteListSlice,
  },
});
