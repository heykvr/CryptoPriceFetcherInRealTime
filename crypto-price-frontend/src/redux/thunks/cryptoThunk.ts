 
import { ICoin, ICoinType } from '../slices/cryptoSlice'
import {createAsyncThunk} from '@reduxjs/toolkit' 
import axios from 'axios'
export const fetchCryptoByName = createAsyncThunk(
  'crypto/fetchCryptoByName',
  async(name:ICoinType, thunkApi
    :any
  )=>{
    try{
      const response  =await axios.get<ICoin[]>(`http://localhost:5000/api/prices/${name}`)
      return response.data;
    }catch(error :any) {
      return  thunkApi.rejectWithValue(error.response)
    }
  }
)