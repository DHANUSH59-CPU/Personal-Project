import { apiSlice } from './apiSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({ url: '/auth/register', method: 'POST', body: data }),
    }),
    login: builder.mutation({
      query: (data) => ({ url: '/auth/login', method: 'POST', body: data }),
    }),
    googleLogin: builder.mutation({
      query: (data) => ({ url: '/auth/google', method: 'POST', body: data }),
    }),
    logout: builder.mutation({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
    }),
    getMe: builder.query({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useGoogleLoginMutation, useLogoutMutation, useGetMeQuery } = authApi;
