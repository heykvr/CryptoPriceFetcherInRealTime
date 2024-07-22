import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchCryptoByName } from '../thunks/cryptoThunk';

export type ICoinType = 'bitcoin' | 'ethereum' | 'ripple' | 'litecoin' | 'cardano';

export interface ICoin {
  crypto:string;
  timestamp: string;
  price: number;
}

export interface CryptoSliceState {
  isload: boolean;
  error: string | null;
  data: ICoin[];
  coinType: ICoinType;
}

const initialState: CryptoSliceState = {
  isload: false,
  error: null,
  data: [],
  coinType: 'bitcoin',
};

export const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    updateCoinType: (state, action: PayloadAction<ICoinType>) => {
      state.coinType = action.payload;
    },
    updateNewPrices :(state,action:PayloadAction<ICoin[]>)=>{
      state.data = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoByName.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isload = false;
        state.error = null;
        state.coinType = action.meta.arg;
      })
      .addCase(fetchCryptoByName.pending, (state) => {
        state.isload = true;
        state.error = null;
      })
      .addCase(fetchCryptoByName.rejected, (state, action) => {
        state.isload = false;
        state.error = action.error.message || 'Failed to fetch data';
      });
  },
});

export const { updateCoinType,updateNewPrices } = cryptoSlice.actions;
export default cryptoSlice.reducer;
