import React, { useEffect } from 'react';
import { useGetMeQuery } from '../../store/api/authApi';
import { useGetCartQuery } from '../../store/api/cartApi';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setUser } from '../../store/slices/authSlice';
import { setCart } from '../../store/slices/cartSlice';

const AuthInitializer: React.FC = () => {
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.auth);

    // Fetch user data if token exists
    const { data: userData, isSuccess: isUserSuccess } = useGetMeQuery(undefined, {
        skip: !token,
    });

    // Fetch cart data if token exists
    const { data: cartData, isSuccess: isCartSuccess } = useGetCartQuery(undefined, {
        skip: !token,
    });

    useEffect(() => {
        if (isUserSuccess && userData?.data) {
            dispatch(setUser(userData.data));
        }
    }, [isUserSuccess, userData, dispatch]);

    useEffect(() => {
        if (isCartSuccess && cartData?.data) {
            dispatch(setCart({
                items: cartData.data.cart.items,
                restaurant: cartData.data.cart.restaurant || null,
                subtotal: cartData.data.subtotal,
                itemCount: cartData.data.itemCount
            }));
        }
    }, [isCartSuccess, cartData, dispatch]);

    return null;
};

export default AuthInitializer;
