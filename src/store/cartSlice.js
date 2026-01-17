import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = "https://json-server-api-dtr8.onrender.com/cart";

// ✅ Fetch all cart items
export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const res = await axios.get(API_URL);
  return res.data;
});

// ✅ Add or Update cart item
export const addToCart = createAsyncThunk("cart/addToCart", async (product, { getState }) => {
  const { cart } = getState();

  // Convert all ids to numbers (JSON Server sometimes stores as string)
  const existing = cart.items.find(item => Number(item.pid) === Number(product.pid));

  if (existing) {
    // Update quantity
    const updatedItem = { ...existing, quantity: existing.quantity + 1 };
    await axios.put(`${API_URL}/${existing.id}`, updatedItem);
    return updatedItem;
  } else {
    // Add new product
    const newItem = { ...product, quantity: 1 };
    const res = await axios.post(API_URL, newItem);
    return res.data;
  }
});

// ✅ Increment quantity
export const incrementQuantity = createAsyncThunk("cart/increment", async (pid, { getState }) => {
  const { cart } = getState();
  const item = cart.items.find(i => Number(i.pid) === Number(pid));
  if (!item) return;
  const updated = { ...item, quantity: item.quantity + 1 };
  await axios.put(`${API_URL}/${item.id}`, updated);
  return updated;
});

// ✅ Decrement quantity or remove item
export const decrementQuantity = createAsyncThunk("cart/decrement", async (pid, { getState }) => {
  const { cart } = getState();
  const item = cart.items.find(i => Number(i.pid) === Number(pid));
  if (!item) return;

  if (item.quantity <= 1) {
    await axios.delete(`${API_URL}/${item.id}`);
    return { id: item.id, remove: true };
  } else {
    const updated = { ...item, quantity: item.quantity - 1 };
    await axios.put(`${API_URL}/${item.id}`, updated);
    return updated;
  }
});

// ✅ Remove from cart manually
export const removeFromCart = createAsyncThunk("cart/removeFromCart", async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return { id };
});

// ✅ Clear all cart items
export const clearCart = createAsyncThunk("cart/clearCart", async () => {
  const res = await axios.get(API_URL);
  await Promise.all(res.data.map(item => axios.delete(`${API_URL}/${item.id}`)));
  return [];
});

// ✅ Slice
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalQuantity:0 ,
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
       
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const updated = action.payload;
        const existing = state.items.find(i => i.id === updated.id);
        if (existing) {
          existing.quantity = updated.quantity;
        } else {
          state.items.push(updated);
          state.totalQuantity += 1;
        }
      })
      .addCase(incrementQuantity.fulfilled, (state, action) => {
        const updated = action.payload;
        const existing = state.items.find(i => i.id === updated.id);
        if (existing) existing.quantity = updated.quantity;
      })
      .addCase(decrementQuantity.fulfilled, (state, action) => {
        const result = action.payload;
        if (result.remove) {
          state.items = state.items.filter(i => i.id !== result.id);
        } else if (result?.id) {
          const existing = state.items.find(i => i.id === result.id);
          if (existing) existing.quantity = result.quantity;
        }
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        const { id } = action.payload;
        state.items = state.items.filter(i => i.id !== id);
        state.totalQuantity -= 1;

      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
         state.totalQuantity = 0;
      });
  },
});

export default cartSlice.reducer;
