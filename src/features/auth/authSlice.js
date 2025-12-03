import { createSlice } from "@reduxjs/toolkit";

// Initial state of authentication-related data
const initialState = {
  user: null, // Stores the user information after login
  token: null, // Stores the authentication token
  isAuthenticated: false, // Indicates if the user is authenticated
  loading: true, // Tracks loading state during authentication processes
  error: null, // Stores any authentication-related errors
  isAdmin: false, // Indicates if the authenticated user has admin privileges
};

// Creating the authentication slice using Redux Toolkit
export const authSlice = createSlice({
  name: "auth", // Name of the slice
  initialState, // Assigning the initial state
  reducers: {
    // Defining the reducers (functions to update state)

    // Stores any authentication-related errors and stops loading
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Sets the loading state to true when an authentication process is ongoing
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

// Exporting action creators to be used in components
export const { setError, setLoading } = authSlice.actions;

// Exporting the reducer to be used in the Redux store
export default authSlice.reducer;
