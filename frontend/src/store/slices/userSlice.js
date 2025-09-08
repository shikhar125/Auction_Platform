import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    isAuthenticated: false,
    user: {},
    leaderboard: [],
  },
  reducers: {
    registerRequest(state, action) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    registerFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
    },
    loginRequest(state, action) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    loginFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
    },
    fetchUserRequest(state, action) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
    },
    fetchUserSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    fetchUserFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
    },

    logoutRequest(state, action) {
      state.loading = true;
    },
    logoutSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
    },
    logoutFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
    },
    fetchLeaderboardRequest(state, action) {
      state.loading = true;
      state.leaderboard = [];
    },
    fetchLeaderboardSuccess(state, action) {
      state.loading = false;
      state.leaderboard = action.payload;
    },
    fetchLeaderboardFailed(state, action) {
      state.loading = false;
      state.leaderboard = [];
    },
    clearAllErrors(state, action) {
      // This is called at the end of every thunk. The success/failed reducers
      // already handle the loading state. This can be safely removed if no
      // error state management is added.
    },
  },
});

export const register = (data) => async (dispatch) => {
  dispatch(userSlice.actions.registerRequest());
  try {
    const response = await axios.post(
      "https://auction-platform-backend-8dj2.onrender.com/api/v1/user/register",
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    dispatch(userSlice.actions.registerSuccess(response.data));
    toast.success(response.data.message);
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.registerFailed());
    if (error.response && error.response.data && error.response.data.message) {
      toast.error(error.response.data.message);
    } else if (error.code === 'ECONNREFUSED') {
      toast.error("Cannot connect to server. Please check if the backend is running.");
    } else {
      toast.error("Registration failed. Please try again.");
    }
    console.error("Registration error:", error);
    dispatch(userSlice.actions.clearAllErrors());
  }
};

export const login = (data) => async (dispatch) => {
  dispatch(userSlice.actions.loginRequest());
  try {
    const response = await axios.post(
      "https://auction-platform-backend-8dj2.onrender.com/api/v1/user/login",
      data, // Send the data object directly, assuming it's { email, password }
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    dispatch(userSlice.actions.loginSuccess(response.data));
    toast.success(response.data.message);
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.loginFailed());
    if (error.response && error.response.data && error.response.data.message) {
      toast.error(error.response.data.message);
    } else if (error.code === 'ECONNREFUSED') {
      toast.error("Cannot connect to server. Please check if the backend is running.");
    } else {
      toast.error("Login failed. Please try again.");
    }
    console.error("Login error:", error);
    dispatch(userSlice.actions.clearAllErrors());
  }
};

export const logout = () => async (dispatch) => {
  dispatch(userSlice.actions.logoutRequest());
  try {
    const response = await axios.get(
      "https://auction-platform-backend-8dj2.onrender.com/api/v1/user/logout",
      { withCredentials: true }
    );
    dispatch(userSlice.actions.logoutSuccess());
    toast.success(response.data.message);
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    // Always clear the user's session on the frontend after a logout attempt.
    dispatch(userSlice.actions.logoutFailed()); // This will now correctly clear the state.
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Logout failed.");
    }
    console.error("Logout error:", error);
    dispatch(userSlice.actions.clearAllErrors());
  }
};

export const fetchUser = () => async (dispatch) => {
  dispatch(userSlice.actions.fetchUserRequest());
  try {
    const response = await axios.get("https://auction-platform-backend-8dj2.onrender.com/api/v1/user/me", {
      withCredentials: true,
    });
    dispatch(userSlice.actions.fetchUserSuccess(response.data.user));
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    // Handle different types of errors gracefully
    if (error.response) {
      // Server responded with error status
      if (error.response.status === 400) {
        // 400 Bad Request - this could be due to missing token or invalid token format
        // Don't show error toast for 400 as it's expected when user is not authenticated
        console.log("User not authenticated or invalid token");
      } else if (error.response.status !== 401) {
        // For other non-401 errors, show feedback
        toast.error(error.response.data.message || "Failed to fetch user session.");
      }
    } else if (error.code === 'ECONNREFUSED') {
      toast.error("Cannot connect to server. Please check if the backend is running.");
    } else {
      // Network error or other issues
      console.error("Network error:", error);
    }
    
    dispatch(userSlice.actions.fetchUserFailed()); // This correctly sets isAuthenticated to false.
    dispatch(userSlice.actions.clearAllErrors());
    
    // Avoid logging expected 401/400 errors to the console
    if (!error.response || (error.response.status !== 401 && error.response.status !== 400)) {
      console.error("Fetch user error:", error);
    }
  }
};

export const fetchLeaderboard = () => async (dispatch) => {
  dispatch(userSlice.actions.fetchLeaderboardRequest());
  try {
    const response = await axios.get(
      "https://auction-platform-backend-8dj2.onrender.com/api/v1/user/leaderboard",
      {
        withCredentials: true,
      }
    );
    dispatch(
      userSlice.actions.fetchLeaderboardSuccess(response.data.leaderboard)
    );
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.fetchLeaderboardFailed());
    dispatch(userSlice.actions.clearAllErrors());
    console.error(error);
  }
};

export default userSlice.reducer;
