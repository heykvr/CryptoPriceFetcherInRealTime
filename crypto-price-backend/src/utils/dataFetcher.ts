import axios from 'axios';
import cron from 'node-cron';
import PriceData from '../models/PriceData';

const symbols = ['bitcoin', 'ethereum', 'ripple', 'litecoin', 'cardano'];

async function fetchPrices() {
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${symbols.join(',')}&vs_currencies=usd`);
    const data = response.data;

    const prices = new Map<string, number>();
    for (const symbol of symbols) {
      prices.set(symbol, data[symbol].usd);
    }

    const pricesData= new PriceData({ prices });
    await pricesData.save()


    console.log('Prices fetched and stored successfully');
  } catch (error) {
    console.error('Error fetching or storing prices:', error);
  }
}

export function startDataFetching() {
  // Fetch immediately on start
  fetchPrices();

  // Then fetch every 10 seconds
  cron.schedule('*/10 * * * * *', fetchPrices);
}