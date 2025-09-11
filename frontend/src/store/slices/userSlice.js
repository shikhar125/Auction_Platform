import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// Helper to get token for auth headers
const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    withCredentials: true,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    isAuthenticated: false,
    user: {},
    leaderboard: [],
  },
  reducers: {
    registerRequest(state) {
      state.loading = true;
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      // Save token to localStorage
      localStorage.setItem("token", action.payload.user.token);
    },
    registerFailed(state) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
    },
    loginRequest(state) {
      state.loading = true;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      localStorage.setItem("token", action.payload.user.token);
    },
    loginFailed(state) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
    },
    fetchUserRequest(state) {
      state.loading = true;
    },
    fetchUserSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    fetchUserFailed(state) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      localStorage.removeItem("token");
    },
    logoutRequest(state) {
      state.loading = true;
    },
    logoutSuccess(state) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      localStorage.removeItem("token");
    },
    logoutFailed(state) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      localStorage.removeItem("token");
    },
    fetchLeaderboardRequest(state) {
      state.loading = true;
    },
    fetchLeaderboardSuccess(state, action) {
      state.loading = false;
      state.leaderboard = action.payload;
    },
    fetchLeaderboardFailed(state) {
      state.loading = false;
      state.leaderboard = [];
    },
  },
});

export const register = (data) => async (dispatch) => {
  dispatch(userSlice.actions.registerRequest());
  try {
    const response = await axios.post(
      "https://auction-platform-backend-8dj2.onrender.com/api/v1/user/register",
      data,
      { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
    );
    dispatch(userSlice.actions.registerSuccess(response.data));
    toast.success(response.data.message);
  } catch (error) {
    dispatch(userSlice.actions.registerFailed());
    toast.error(error.response?.data?.message || "Registration failed");
    console.error("Registration error:", error);
  }
};

export const login = (data) => async (dispatch) => {
  dispatch(userSlice.actions.loginRequest());
  try {
    const response = await axios.post(
      "https://auction-platform-backend-8dj2.onrender.com/api/v1/user/login",
      data,
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );
    dispatch(userSlice.actions.loginSuccess(response.data));
    toast.success(response.data.message);
  } catch (error) {
    dispatch(userSlice.actions.loginFailed());
    toast.error(error.response?.data?.message || "Login failed");
    console.error("Login error:", error);
  }
};

export const logout = () => async (dispatch) => {
  dispatch(userSlice.actions.logoutRequest());
  try {
    await axios.get(
      "https://auction-platform-backend-8dj2.onrender.com/api/v1/user/logout",
      { withCredentials: true }
    );
    dispatch(userSlice.actions.logoutSuccess());
    toast.success("Logged out successfully");
  } catch (error) {
    dispatch(userSlice.actions.logoutFailed());
    toast.error(error.response?.data?.message || "Logout failed");
    console.error("Logout error:", error);
  }
};

export const fetchUser = () => async (dispatch) => {
  dispatch(userSlice.actions.fetchUserRequest());
  try {
    const response = await axios.get(
      "https://auction-platform-backend-8dj2.onrender.com/api/v1/user/me",
      getAuthConfig()
    );
    dispatch(userSlice.actions.fetchUserSuccess(response.data.user));
  } catch (error) {
    dispatch(userSlice.actions.fetchUserFailed());
    console.log("User not authenticated or invalid token");
  }
};

export const fetchLeaderboard = () => async (dispatch) => {
  dispatch(userSlice.actions.fetchLeaderboardRequest());
  try {
    const response = await axios.get(
      "https://auction-platform-backend-8dj2.onrender.com/api/v1/user/leaderboard"
    );
    dispatch(userSlice.actions.fetchLeaderboardSuccess(response.data.leaderboard));
  } catch (error) {
    dispatch(userSlice.actions.fetchLeaderboardFailed());
    console.error("Leaderboard fetch error:", error);
  }
};

export default userSlice.reducer;
