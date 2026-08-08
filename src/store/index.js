import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import { replaceCart } from "./cartSlice";

export const store = configureStore({
  reducer: { cart: cartReducer },
});

store.subscribe(() => {
  localStorage.setItem("hajex-cart", JSON.stringify(store.getState().cart.items));
});

window.addEventListener("storage", (event) => {
  if (event.key !== "hajex-cart") return;
  try {
    store.dispatch(replaceCart(JSON.parse(event.newValue) || []));
  } catch {
    store.dispatch(replaceCart([]));
  }
});
