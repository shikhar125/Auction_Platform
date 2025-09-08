import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    return savedTheme === "dark";
  }
  // Default to light mode if no preference is saved
  return false;
};

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    isDarkMode: getInitialTheme(),
  },
  reducers: {
    toggleTheme(state) {
      state.isDarkMode = !state.isDarkMode;
      // Save to localStorage
      localStorage.setItem("theme", state.isDarkMode ? "dark" : "light");
    },
    setTheme(state, action) {
      state.isDarkMode = action.payload;
      localStorage.setItem("theme", state.isDarkMode ? "dark" : "light");
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
