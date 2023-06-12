import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
export const getWeatherAsync = createAsyncThunk(
  "weather/getWeatherAsync",
  async (selectedCity, { dispatch }) => {
    const res = await axios(
      `${process.env.REACT_APP_API_BASE_ENDPOINT}?q=${selectedCity}&appid=${process.env.REACT_APP_API_KEY}&units=metric&lang=${lang}`
    );
    return [res.data]; //gelen veriyi item dizisi içinde göstermek için...
  }
);

const lang = navigator.language.split("-")[0];

export const getCitiesAsync = createAsyncThunk(
  "cities/getCitiesAsync",
  async () => {
    const res = await axios(
      "https://gist.githubusercontent.com/ozdemirburak/4821a26db048cc0972c1beee48a408de/raw/4754e5f9d09dade2e6c461d7e960e13ef38eaa88/cities_of_turkey.json"
    );
    return res.data;
  }
);

export const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    cities: [], // Şehir verilerini tutmak için boş bir dizi
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: {
    [getWeatherAsync.fulfilled]: (state, action) => {
      state.items = action.payload[0].list;
    },
    [getCitiesAsync.fulfilled]: (state, action) => {
      state.cities = action.payload;
    },
  },
});

export default weatherSlice.reducer;
