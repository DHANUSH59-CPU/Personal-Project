import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { clearCredentials, setCredentials } from '../store/slices/authSlice';

// On web (AWS): use relative '/api' (same origin)
// On mobile app: use the full AWS backend URL
// Capacitor injects itself onto window at runtime — no import needed
const isNative = typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.();
const API_BASE_URL = isNative
  ? 'https://www.dsenterprises4u.com/api'
  : '/api';

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Auto-refresh on 401
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    // Try to refresh
    const refreshResult = await baseQuery(
      { url: '/auth/refresh', method: 'POST' },
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      const { accessToken } = refreshResult.data.data;
      const user = api.getState().auth.user;
      api.dispatch(setCredentials({ user, accessToken }));
      // Retry original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearCredentials());
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Product', 'Category', 'Cart', 'Order', 'User', 'Review', 'Coupon'],
  endpoints: () => ({}),
});
