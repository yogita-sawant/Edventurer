import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  // Color Palette Options with Cursive Fonts
  const colorSchemes = {
    // Vibrant Neon Cyberpunk
    cyberpunk: {
      title: "text-cyan-300 font-['Brush_Script_MT']",
      subtitle: "text-pink-400 font-['Lucida_Handwriting']",
      button:
        "bg-[#00ffff] text-black hover:bg-[#00cccc] font-['Comic_Sans_MS']",
      overlay: "bg-black opacity-60",
    },

    // Warm Sunset
    sunset: {
      title: "text-orange-200 font-['Brush_Script_MT']",
      subtitle: "text-amber-300 font-['Lucida_Handwriting']",
      button:
        "bg-[#FF6B35] text-white hover:bg-[#F44336] font-['Comic_Sans_MS']",
      overlay: "bg-black opacity-50",
    },

    // Cool Mint
    mint: {
      title: "text-teal-200 font-['Brush_Script_MT']",
      subtitle: "text-green-300 font-['Lucida_Handwriting']",
      button:
        "bg-[#10B981] text-white hover:bg-[#059669] font-['Comic_Sans_MS']",
      overlay: "bg-black opacity-55",
    },

    // Lavender Dream
    lavender: {
      title: "text-purple-300 font-['Brush_Script_MT']",
      subtitle: "text-indigo-200 font-['Lucida_Handwriting']",
      button:
        "bg-[#8A4FFF] text-white hover:bg-[#7930FF] font-['Comic_Sans_MS']",
      overlay: "bg-black opacity-55",
    },
  };

  // Select a color scheme (you can change this or make it dynamic)
  const scheme = colorSchemes.lavender;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Video Background with Overlay */}
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

        {/* Dark Overlay */}
        <div className={`absolute inset-0 ${scheme.overlay}`}></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center space-y-6">
        <h1
          className={`
          text-5xl 
          md:text-7xl 
          font-bold 
          ${scheme.title}
          drop-shadow-[0_4px_3px_rgba(0,0,0,0.5)]
          animate-pulse
        `}
        >
          Oasys-Odyssey
        </h1>
        <p
          className={`
          text-2xl
          md:text-xl 
          font-semibold 
          ${scheme.subtitle}
          drop-shadow-lg
        `}
        >
          Explore, Earn, and Own the World Around You
        </p>
        <button
          onClick={() => navigate("/events")}
          className={`
            ${scheme.button}
            font-bold 
            py-2 
            px-4 
            rounded-lg 
            transition-all 
            duration-300 
            ease-in-out 
            shadow-lg 
            hover:shadow-xl 
            focus:outline-none 
            focus:ring-2 
            focus:ring-opacity-75
          `}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
