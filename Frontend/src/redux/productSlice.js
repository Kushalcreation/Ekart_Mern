import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "Product",

  initialState: {
    products: [],
    cart: [],
    addresses: [],
    selectedAddress: null,
  },

  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },

    setCart: (state, action) => {
      state.cart = action.payload;
    },

    // Add a new address
    setAddress: (state, action) => {
      if (!state.addresses) state.addresses = [];
      state.addresses.push(action.payload);
    },

    // Select an address by index
    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },

    // Delete an address by index
    deleteAddress: (state, action) => {
      const index = action.payload;

      if (index < 0 || index >= state.addresses.length) {
        return;
      }

      state.addresses.splice(index, 1);

      // Update selected address after deletion
      if (state.addresses.length === 0) {
        state.selectedAddress = null;
      } else if (state.selectedAddress === index) {
        state.selectedAddress = 0;
      } else if (state.selectedAddress > index) {
        state.selectedAddress -= 1;
      }
    },
  },
});

export const {
  setProducts,
  setCart,
  setAddress,
  setSelectedAddress,
  deleteAddress,
} = productSlice.actions;

export default productSlice.reducer;
