import { Coins, ShieldPlus } from "lucide-react";
import { BrowserProvider, Contract } from "ethers";
import contractABI from "./contractABI.json";
import { useEffect, useState } from "react";
const CONTRACT_ADDRESS = "0xf5E491f0772d7dC4F9dF91d8BEC8642aB97b6De0";

const BalanceSection = ({ bal, pos }) => {
  const [currency, setCurrency] = useState("");
  const [position, setPosition] = useState("");
  const readCurrency = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const playerAddress = accounts[0];
      const contract = new Contract(CONTRACT_ADDRESS, contractABI, provider);
      const result = await contract.getPlayerCurrency(playerAddress);
      setCurrency(result.toString());
    } catch (error) {
      console.error("Error reading from contract:", error);
    }
  };

  const readPosition = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const playerAddress = accounts[0];
      const contract = new Contract(CONTRACT_ADDRESS, contractABI, provider);
      const result = await contract.getPlayerPosition(playerAddress);
      setPosition(result.toString());
      localStorage.setItem("playerPosition", result.toString());
    } catch (error) {
      console.error("Error reading from contract:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await readCurrency();
      await readPosition();
    };

    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="absolute bottom-10 left-5 
        bg-gradient-to-br from-indigo-800 to-purple-900 
        text-white 
        p-4 
        rounded-xl 
        shadow-2xl 
        border-2 
        border-yellow-500 
        w-1/5 
        h-auto 
        min-h-[150px]
        flex 
        flex-col 
        space-y-4 
        transform 
        transition-all 
        hover:scale-105 
        hover:shadow-3xl"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Coins className="text-yellow-400 animate-bounce" size={32} />
          <h2 className="text-2xl font-bold text-yellow-300 uppercase tracking-wider">
            Balance
          </h2>
        </div>
        <ShieldPlus className="text-green-400 animate-pulse" size={28} />
      </div>

      <div className="flex-grow flex items-center justify-center gap-8">
        <div className="bg-indigo-700/50 rounded-lg p-3 w-full text-center relative">
          <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600">
            {currency ? currency : 0}
          </span>
          <span className="block text-sm text-gray-300 mt-1">Game Coins</span>
        </div>

        <div className="bg-indigo-700/50 rounded-lg p-3 w-full text-center relative">
          <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600">
            {position ? position : 0}
          </span>
          <span className="block text-sm text-gray-300 mt-1">Position</span>
        </div>
      </div>
    </div>
  );
};

export default BalanceSection;
