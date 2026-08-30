import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "Product",
  initialState: {
    products: [0],
  },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
  },
});

export const { setProducts } = productSlice.actions;
export default productSlice.reducer;
