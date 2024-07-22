import express, { Request, Response } from 'express';
import PriceData from '../models/PriceData';
import expressWs from 'express-ws'; 
 
  const router = express.Router();
 
//REST API ENDPOINTS
router.get('/prices/:crypto', async (req: Request, res: Response) => {
  try {
    const crypto = req.params.crypto;
    const latestPrice = await PriceData.find({ [`prices.${crypto}`]: { $exists: true } })
      .sort({ timestamp: -1 })
      .select(`prices.${crypto} timestamp`).limit(20);
    
    if (!latestPrice) {
      return res.status(404).json({ message: 'Price not found for the specified cryptocurrency' });
    }
    const data  = latestPrice.map((p)=>{
    return  {
        "crypto":crypto,
        "price": p.prices.get(crypto),
        "timestamp": p.timestamp
      }
    })
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching price', error: (error as Error).message });
  }
});

router.get('/prices', async (req: Request, res: Response) => {
  try {
    const prices = await PriceData.find().sort({ timestamp: -1 }).limit(20);
    res.json(prices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prices', error: (error as Error).message });
  }
});


export default router;