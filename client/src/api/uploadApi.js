import { apiSlice } from './apiSlice';

export const uploadApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadImages: builder.mutation({
      query: (formData) => ({
        url: '/upload',
        method: 'POST',
        body: formData,
      }),
    }),
    deleteImage: builder.mutation({
      query: (publicId) => ({
        url: '/upload',
        method: 'DELETE',
        body: { publicId },
      }),
    }),
  }),
});

export const { useUploadImagesMutation, useDeleteImageMutation } = uploadApi;
