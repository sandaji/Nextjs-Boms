import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * Types for the global slice state
 */
export interface InitialStateTypes {
  isSidebarCollapsed: boolean;
}

/**
 * Initial state for the global slice
 */
export const initialState: InitialStateTypes = {
  isSidebarCollapsed: false,
};
// 
/**
 * Global slice for managing application-wide state
 */
export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    /**
     * Toggles the sidebar collapsed state
     * @param state - Current state
     * @param action - Payload containing the new collapsed state
     */
    setIsSidebarCollapsed: (
      state: InitialStateTypes,
      action: PayloadAction<boolean>
    ) => {
      state.isSidebarCollapsed = action.payload;
    },
  },
});

// Export actions
export const { setIsSidebarCollapsed } = globalSlice.actions;

export default globalSlice.reducer;
