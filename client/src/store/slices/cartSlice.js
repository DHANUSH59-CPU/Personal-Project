import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalItems: 0,
  },
  reducers: {
    setCart: (state, action) => {
      const cart = action.payload;
      state.items = cart?.items || [];
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    clearLocalCart: (state) => {
      state.items = [];
      state.totalItems = 0;
    },
  },
});

export const { setCart, clearLocalCart } = cartSlice.actions;
export default cartSlice.reducer;

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalItems = (state) => state.cart.totalItems;
