import { apiSlice } from './apiSlice';
import type { User, Restaurant, ApiResponse } from '../../types';

export const adminApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAdminStats: builder.query<ApiResponse<{
            totalUsers: number;
            totalRestaurants: number;
            totalOrders: number;
            totalRevenue: number;
            recentActivity: Array<{
                _id: string;
                orderNumber: string;
                createdAt: string;
                totalAmount: number;
                orderStatus: string;
            }>;
            popularRestaurants: Array<{
                _id: string;
                name: string;
                image: string;
                totalRevenue: number;
                orderCount: number;
            }>;
        }>, void>({
            query: () => '/admin/stats',
        }),
        getUsers: builder.query<ApiResponse<User[]>, void>({
            query: () => '/users',
            providesTags: ['User'],
        }),
        deleteUser: builder.mutation<ApiResponse<void>, string>({
            query: (id) => ({
                url: `/users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User'],
        }),
        updateUserRole: builder.mutation<ApiResponse<User>, { id: string; role: string }>({
            query: ({ id, role }) => ({
                url: `/users/${id}`,
                method: 'PUT',
                body: { role },
            }),
            invalidatesTags: ['User'],
        }),
        updateUser: builder.mutation<ApiResponse<User>, { id: string; data: Partial<User> }>({
            query: ({ id, data }) => ({
                url: `/users/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        convertToRestaurantOwner: builder.mutation<ApiResponse<{ user: User; restaurant: Restaurant }>, string>({
            query: (id) => ({
                url: `/users/${id}/make-restaurant-owner`,
                method: 'PUT',
            }),
            invalidatesTags: ['User', 'Restaurant'],
        }),
        // Re-using restaurant endpoints but adding specific admin ones if needed
        approveRestaurant: builder.mutation<Restaurant, string>({
            query: (id) => ({
                url: `/restaurants/${id}/toggle`,
                method: 'PUT',
            }),
            invalidatesTags: ['Restaurant'],
        }),
    }),
});

export const {
    useGetAdminStatsQuery,
    useGetUsersQuery,
    useDeleteUserMutation,
    useUpdateUserRoleMutation,
    useUpdateUserMutation,
    useConvertToRestaurantOwnerMutation,
    useApproveRestaurantMutation,
} = adminApi;
