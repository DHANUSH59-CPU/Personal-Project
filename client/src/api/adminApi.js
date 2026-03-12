import { apiSlice } from './apiSlice';

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => '/admin/stats',
      providesTags: ['Product', 'Order', 'User'],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = adminApi;
