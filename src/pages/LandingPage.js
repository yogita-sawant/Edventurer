import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

const LandingPage = () => {
  const navigate = useNavigate();
  const { isConnected } = useAccount();

  const colorSchemes = {
    cyberpunk: {
      title: "text-cyan-300 font-['Brush_Script_MT']",
      subtitle: "text-pink-400 font-['Lucida_Handwriting']",
      button:
        "bg-[#00ffff] text-black hover:bg-[#00cccc] font-['Comic_Sans_MS']",
      overlay: "bg-black opacity-60",
    },

    sunset: {
      title: "text-orange-200 font-['Brush_Script_MT']",
      subtitle: "text-amber-300 font-['Lucida_Handwriting']",
      button:
        "bg-[#FF6B35] text-white hover:bg-[#F44336] font-['Comic_Sans_MS']",
      overlay: "bg-black opacity-50",
    },

    mint: {
      title: "text-teal-200 font-['Brush_Script_MT']",
      subtitle: "text-green-300 font-['Lucida_Handwriting']",
      button:
        "bg-[#10B981] text-white hover:bg-[#059669] font-['Comic_Sans_MS']",
      overlay: "bg-black opacity-55",
    },

    lavender: {
      title: "text-purple-300 font-['Brush_Script_MT']",
      subtitle: "text-indigo-200 font-['Lucida_Handwriting']",
      button:
        "bg-[#8A4FFF] text-white hover:bg-[#7930FF] font-['Comic_Sans_MS']",
      overlay: "bg-black opacity-55",
    },
  };

  const scheme = colorSchemes.lavender;

  useEffect(() => {
    if (isConnected) {
      navigate("/events");
    } else {
      console.log("Wallet did not get connected.");
    }
  }, [isConnected, navigate]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
        >
          <source src="/videos/opener.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className={`absolute inset-0 ${scheme.overlay}`}></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center space-y-6">
        <h1
          className={`text-5xl md:text-7xl font-bold ${scheme.title} drop-shadow-[0_4px_3px_rgba(0,0,0,0.5)] animate-pulse`}
        >
          Edventurer
        </h1>
        <p
          className={`text-2xl md:text-xl font-semibold ${scheme.subtitle} drop-shadow-lg`}
        >
          Unlock Knowledge, Earn Rewards, Own the Journey!
        </p>
        <ConnectButton />
      </div>
    </div>
  );
};

export default LandingPage;
