import { Coins, ShieldPlus, RefreshCw } from "lucide-react";
const BalanceSection = ({ bal, pos }) => {
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
            {bal.toLocaleString()}
          </span>
          <span className="block text-sm text-gray-300 mt-1">Game Coins</span>
        </div>

        <div className="bg-indigo-700/50 rounded-lg p-3 w-full text-center relative">
          <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600">
            {pos.toLocaleString()}
          </span>
          <span className="block text-sm text-gray-300 mt-1">Position</span>
        </div>
      </div>
    </div>
  );
};

export default BalanceSection;
