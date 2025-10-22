import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { salesApi } from '../../api/salesApi';

export const fetchDashboardSummary = createAsyncThunk(
  'sales/fetchDashboardSummary',
  async (params, { rejectWithValue }) => {
    try {
      const data = await salesApi.getDashboardSummary(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchSalesReport = createAsyncThunk(
  'sales/fetchSalesReport',
  async (period, { rejectWithValue }) => {
    try {
      const data = await salesApi.getSalesReport(period);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const salesSlice = createSlice({
  name: 'sales',
  initialState: {
    summary: null,
    report: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSalesReport.fulfilled, (state, action) => {
        state.report = action.payload;
      });
  },
});

export const { clearError } = salesSlice.actions;
export default salesSlice.reducer;
