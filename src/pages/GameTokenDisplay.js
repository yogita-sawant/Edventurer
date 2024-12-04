import { Leaf, Target } from "lucide-react";
import { useState, useEffect } from "react";
import { BrowserProvider } from "ethers";

const GameTokenDisplay = () => {
  const [wallet, setWallet] = useState(null);

  const fetchWalletAddress = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setWallet(accounts[0]);
    } catch (error) {
      console.error("Error fetching wallet address:", error);
    }
  };

  useEffect(() => {
    fetchWalletAddress();
  }, []);

  return (
    <div className="absolute top-4 left-5 bg-gradient-to-br from-green-800 to-emerald-900 text-lime-100 p-4 rounded-xl shadow-lg border-2 border-green-500">
      <div className="flex items-center space-x-4">
        <Leaf className="w-10 h-10 text-green-300 animate-bounce" />
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-widest text-green-200 opacity-80">
            Game Zone Token
          </span>
          <code className="text-md font-mono bg-green-900/50 px-3 py-2 rounded-md tracking-wider border border-green-600">
            {wallet}
          </code>
        </div>
        <Target className="w-10 h-10 text-lime-400 animate-spin" />
      </div>
      <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
        🎮
      </div>
    </div>
  );
};

export default GameTokenDisplay;
