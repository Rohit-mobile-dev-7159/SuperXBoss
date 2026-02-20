// searchSlice.ts
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface RecentSearch {
  _id: string;
  name: string;
}

interface SearchState {
  recentSearches: RecentSearch[];
}

const initialState: SearchState = {
  recentSearches: [],
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    addRecentSearch: (state, action: PayloadAction<RecentSearch>) => {
      // Avoid duplicates by _id
      if (!state.recentSearches.some(item => item._id === action.payload._id)) {
        state.recentSearches = [action.payload, ...state.recentSearches].slice(
          0,
          10,
        );
      }
    },
    removeRecentSearch: (state, action: PayloadAction<string>) => {
      state.recentSearches = state.recentSearches.filter(
        item => item._id !== action.payload,
      );
    },
    clearRecentSearch: state => {
      state.recentSearches = [];
    },
  },
});

export const {addRecentSearch, removeRecentSearch, clearRecentSearch} =
  searchSlice.actions;
export const selectRecentSearches = (state: {search: SearchState}) =>
  state.search?.recentSearches;

export default searchSlice.reducer;
