// import axios from 'axios';
// import PriceData from '../models/PriceData';
// export async function fetchCryptoData(): Promise<void> {
//   try {
//     const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple,litecoin,cardano&vs_currencies=usd');
//     const data = response.data;
//     const priceData = new PriceData({
//       prices: new Map(Object.entries(data).map(([key, value]: [string, any]) => [key, value.usd]))
//     });
//     await priceData.save();
//     console.log('Data fetched and stored successfully');
//   } catch (error) {
//     console.error('Error fetching or storing data:', error);
//   }
// }