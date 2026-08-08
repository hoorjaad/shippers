import { createSlice } from "@reduxjs/toolkit";

const storedCart = () => {
  try {
    const items = JSON.parse(localStorage.getItem("hajex-cart"));
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: storedCart() },
  reducers: {
    addToCart(state, action) {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) existing.quantity += 1;
      else state.items.push({ ...action.payload, quantity: 1 });
    },
    decreaseQuantity(state, action) {
      const existing = state.items.find((item) => item.id === action.payload);
      if (!existing) return;
      if (existing.quantity > 1) existing.quantity -= 1;
      else state.items = state.items.filter((item) => item.id !== action.payload);
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
    replaceCart(state, action) {
      state.items = Array.isArray(action.payload) ? action.payload : [];
    },
  },
});

export const {
  addToCart,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  replaceCart,
} = cartSlice.actions;
export default cartSlice.reducer;
