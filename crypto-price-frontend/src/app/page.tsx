"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { fetchCryptoByName } from "@/redux/thunks/cryptoThunk";
import { ICoin, ICoinType, updateCoinType, updateNewPrices } from "@/redux/slices/cryptoSlice";
import { io, Socket } from "socket.io-client";
import Modal from "./components/Modal";

export default function Home() {
  const dispatch = useAppDispatch();
  const { data, isload, error, coinType } = useAppSelector((state) => state.crypto);
  
  const [socket, setSocket] = useState<Socket | null>(null);
  
  useEffect(() => {
    console.log(coinType);
    if (socket) {
      socket.send(JSON.stringify({ clientId: socket.id, coinType }));
    }
  }, [coinType]);

  useEffect(() => {
    const socket: Socket = io('http://localhost:5000');
    setSocket(socket);
    socket.on('connect',async () => {
      console.log('Connected to WebSocket server');
      const str = await JSON.stringify({ clientId: `${socket.id}`, coinType })
         socket.send(str); 
    });

    socket.on('priceUpdate', (data: string) => {
      const updatedData: ICoin[] = JSON.parse(data);
      console.log(updatedData);
     
      dispatch(updateNewPrices(updatedData));
    });

    socket.on('connect_error', () => {
      console.log('WebSocket connection error');
    });

    socket.on('disconnect', () => {
      console.log('WebSocket connection closed');
    });

    return () => {
      socket.disconnect();
    };
  }, [crypto]);
 const handleCryptoChange = (crypto: ICoinType) => {
    dispatch(updateCoinType(crypto));
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-800 text-white shadow-md sticky top-2">
  <div className="container mx-auto px-4 py-3 flex justify-between items-center ">
    <h1 className="text-2xl font-bold">Real-time Prices</h1>
    <button
      onClick={() => setIsModalOpen(true)}
      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-150 ease-in-out"
    >
      Change Crypto
    </button>
  </div>
</div>
<br />

        { (
        <table
          className="min-w-full bg-white border border-gray-200 rounded-md shadow-lg"
           
        >
          <thead>
    <tr className="bg-gray-200">
      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Crypto</th>
      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Price</th>
      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Timestamp</th>
    </tr>
  </thead>
  <tbody>
    {
    
    data
      .filter((coin) => coin.crypto === coinType)
      .map((coin) => (
        <motion.tr key={coin.timestamp} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <td className="py-4 px-6 border-b border-gray-200 w-1/3">{coin.crypto}</td>
          <td className="py-4 px-6 border-b border-gray-200 w-1/3">{coin.price}</td>
          <td className="py-4 px-6 border-b border-gray-200 w-1/3">
            {new Date(coin.timestamp).toLocaleString()}
          </td>
        </motion.tr>
      ))}
  </tbody>

        </table>
      )}
      <AnimatePresence>
        {isModalOpen && (
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <h2 className="text-xl mb-4">Select Cryptocurrency</h2>
            <div className="flex flex-col space-y-2">
              <button onClick={() => handleCryptoChange("bitcoin")} className="px-4 py-2 bg-blue-500 text-white rounded">
                Bitcoin
              </button>
              <button onClick={() => handleCryptoChange("ethereum")} className="px-4 py-2 bg-blue-500 text-white rounded">
                Ethereum
              </button>
              <button onClick={() => handleCryptoChange("ripple")} className="px-4 py-2 bg-blue-500 text-white rounded">
                Ripple
              </button>
              <button onClick={() => handleCryptoChange("litecoin")} className="px-4 py-2 bg-blue-500 text-white rounded">
                Litecoin
              </button>
              <button onClick={() => handleCryptoChange("cardano")} className="px-4 py-2 bg-blue-500 text-white rounded">
                Cardano
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
