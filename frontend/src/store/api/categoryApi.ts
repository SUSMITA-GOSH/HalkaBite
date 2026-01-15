import { apiSlice } from './apiSlice';
import type { Category, ApiResponse } from '../../types';

export const categoryApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query<ApiResponse<Category[]>, void>({
            query: () => '/categories',
            providesTags: ['Category'],
        }),
        createCategory: builder.mutation<ApiResponse<Category>, Partial<Category>>({
            query: (data) => ({
                url: '/categories',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Category'],
        }),
        updateCategory: builder.mutation<ApiResponse<Category>, { id: string; data: Partial<Category> }>({
            query: ({ id, data }) => ({
                url: `/categories/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Category'],
        }),
        deleteCategory: builder.mutation<ApiResponse, string>({
            query: (id) => ({
                url: `/categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Category'],
        }),
    }),
});

export const { useGetCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } = categoryApi;
