import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { startDataFetching } from './utils/dataFetcher';
import PriceData from './models/PriceData';
import pricesRoutes from './routes/priceRoutes';
import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
  },
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api', pricesRoutes);

mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log('MongoDB connected');
    startDataFetching();
  })
  .catch(err => console.log('MongoDB connection error:', err));

interface IClient {
  clientId: string;
  coinType: string;
}

let clients: IClient[] = [];

io.on('connection', (socket: Socket) => {
  console.log('Client connected');

  socket.on('message', async (message: string) => {
  console.log('message' , message);
  
  const clientMessage: IClient = JSON.parse(message);
  console.log('clientMessage' , message);
    
    clients.push({ ...clientMessage, clientId: socket.id });

    // // Send initial data
    await sendUpdates(clientMessage.coinType, socket);
  });

  socket.on('disconnect', () => {
    clients = clients.filter(client => client.clientId !== socket.id);
    console.log('Client disconnected');
  });
});

const sendUpdates = async (coinType: string, socket: Socket) => {
 ;
  try {
    const latestPrice = await PriceData.find({ [`prices.${coinType}`]: { $exists: true } })
    .sort({ timestamp: -1 })
    .select(`prices.${coinType} timestamp`).limit(20);  
    
    const data  = latestPrice.map((p)=>{
      return  {
        "crypto":coinType,
        "price": p.prices.get(coinType),
        "timestamp": p.timestamp
      }
    })  
    socket.emit('priceUpdate', JSON.stringify(data));
  } catch (error) {
    console.error('Error sending updates:', error);
  }
};

const broadcastUpdates = async () => {
  for (const client of clients) {
    const socket = io.sockets.sockets.get(client.clientId);
    if (socket) {
      await sendUpdates(client.coinType, socket);
    }
  }
};

setInterval(broadcastUpdates, 5000);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
