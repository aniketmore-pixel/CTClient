// src/store/admin/design-submissions-slice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchAllDesignSubmissions = createAsyncThunk(
  'designSubmissions/fetchAllDesignSubmissions',
  async () => {
    // Replace with your actual API call
    return await fetch('/api/design-submissions').then((res) => res.json());
  }
);

export const addNewProductFromDesign = createAsyncThunk(
  'designSubmissions/addNewProductFromDesign',
  async ({ designId, formData }) => {
    // Replace with your actual API call
    return await fetch(`/api/designsubmissions`, {
      method: 'POST',
      body: JSON.stringify({ designId, ...formData }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json());
  }
);

export const deleteDesignSubmission = createAsyncThunk(
  'designSubmissions/deleteDesignSubmission',
  async (designId) => {
    // Replace with your actual API call
    return await fetch(`/api/design-submissions/${designId}`, { method: 'DELETE' }).then((res) => res.json());
  }
);

const designSubmissionsSlice = createSlice({
  name: 'designSubmissions',
  initialState: {
    designSubmissions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllDesignSubmissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllDesignSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.designSubmissions = action.payload;
      })
      .addCase(fetchAllDesignSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addNewProductFromDesign.fulfilled, (state, action) => {
        // Optionally handle any state updates after product creation
      })
      .addCase(deleteDesignSubmission.fulfilled, (state, action) => {
        // Optionally handle state updates after deletion
      });
  },
});

// Export the reducer
export default designSubmissionsSlice.reducer;
