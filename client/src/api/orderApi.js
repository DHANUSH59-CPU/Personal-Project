import { apiSlice } from './apiSlice';

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => ({ url: '/orders', method: 'POST', body: data }),
      invalidatesTags: ['Cart', 'Order'],
    }),
    getUserOrders: builder.query({
      query: (params) => ({ url: '/orders', params }),
      providesTags: ['Order'],
    }),
    getOrder: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    initiatePayment: builder.mutation({
      query: (orderId) => ({ url: `/orders/${orderId}/pay`, method: 'POST' }),
    }),
    verifyPayment: builder.mutation({
      query: (data) => ({ url: '/orders/verify-payment', method: 'POST', body: data }),
      invalidatesTags: ['Order'],
    }),
    // Admin
    getAllOrders: builder.query({
      query: (params) => ({ url: '/orders/admin/all', params }),
      providesTags: ['Order'],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, orderStatus }) => ({
        url: `/orders/${id}/status`,
        method: 'PUT',
        body: { orderStatus },
      }),
      invalidatesTags: ['Order'],
    }),
    cancelOrder: builder.mutation({
      query: (id) => ({ url: `/orders/${id}/cancel`, method: 'PATCH' }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetUserOrdersQuery,
  useGetOrderQuery,
  useInitiatePaymentMutation,
  useVerifyPaymentMutation,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
} = orderApi;
