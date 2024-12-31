import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import GameLoader from "./GameLoader";
import GameTokenDisplay from "./GameTokenDisplay";
import BankSectionToggle from "./BankSectionToggle";
import LoanCard from "./LoanCard";
import { Coins, ShieldPlus } from "lucide-react";
import carddata from "../data/cards";
import { BrowserProvider, Contract } from "ethers";
import contractABI from "./contractABI.json";
const CONTRACT_ADDRESS = "0xf5E491f0772d7dC4F9dF91d8BEC8642aB97b6De0";

const DashboardPage = () => {
  const navigate = useNavigate();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const playerMarkerRef = useRef(null);

  const [playerLocation, setPlayerLocation] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [showLoanCard, setShowLoanCard] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [pos, setPosition] = useState(0);
  const [loan, setLoanAmt] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isMakeMoveActive, setIsMakeMoveActive] = useState(true);
  const [playerCurrency, setPlayerCurrency] = useState(
    parseInt(localStorage.getItem("playerCurrency"), 10) || 0
  );
  const [currency, setCurrency] = useState("");
  const [card, setCard] = useState();
  const [isMoving, setIsMoving] = useState(false);
  const [isLoadingCard, setIsLoadingCard] = useState(false);

  const monopolyLocations = carddata.cards;

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoibWltaW8iLCJhIjoiY2l6ZjJoenBvMDA4eDJxbWVkd2IzZjR0ZCJ9.ppwGNP_-LS2K4jUvgXG2pA";

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [0, 0],
      zoom: 1,
      style: "mapbox://styles/mapbox/satellite-v9",
      projection: "globe",
    });

    mapRef.current.on("load", () => {
      let rotation = 0;
      const rotateMap = () => {
        if (rotation < 360) {
          rotation += 1;
          mapRef.current.rotateTo(rotation, { duration: 100 });
          requestAnimationFrame(rotateMap);
        } else {
          flyToLocation(playerLocation, true);
        }
      };
      if (playerLocation === 0) {
        rotateMap();
      }
    });

    playerMarkerRef.current = new mapboxgl.Marker({
      color: "red",
    })
      .setLngLat(monopolyLocations[playerLocation].coordinates)
      .addTo(mapRef.current);

    monopolyLocations.forEach((location, index) => {
      const marker = new mapboxgl.Marker({
        element: createCustomMarkerElement(location.type),
      })
        .setLngLat(location.coordinates)
        .addTo(mapRef.current);

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <h3 style="cursor:pointer; color:blue;" id="location-${location.name}">
            ${location.name}
          </h3>
          <p>${location.details}</p>
        `);

      marker.setPopup(popup);
      marker.getElement().addEventListener("click", () => {
        marker.togglePopup();
        navigate(`/location/${location.name}`, {
          state: { location },
        });
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (playerMarkerRef.current) {
      playerMarkerRef.current.setLngLat(
        monopolyLocations[playerLocation].coordinates
      );
    }
  }, [playerLocation]);

  const createCustomMarkerElement = (placeType) => {
    const markerElement = document.createElement("div");
    markerElement.style.width = "30px";
    markerElement.style.height = "30px";
    markerElement.style.backgroundSize = "cover";

    const icons = {
      loc: "/images/club.png",
    };

    const iconUrl = icons[placeType] || "/images/club.png";

    markerElement.style.backgroundImage = `url('${iconUrl}')`;

    return markerElement;
  };

  const flyToLocation = (index, isFirstLocation = false) => {
    if (index >= 0 && index < monopolyLocations.length) {
      const flyOptions = {
        center: monopolyLocations[index].coordinates,
        zoom: 16.5,
        pitch: 40,
        bearing: 53,
        speed: isFirstLocation ? 0.4 : 0.8,
        curve: 1.5,
        essential: true,
      };

      mapRef.current.flyTo(flyOptions);
    }
  };

  const readCurrency = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const playerAddress = accounts[0];
      const contract = new Contract(CONTRACT_ADDRESS, contractABI, provider);
      const result = await contract.getPlayerCurrency(playerAddress);
      localStorage.setItem("playerCurrency", result.toString());
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
      setCard(carddata.cards[result]);
      localStorage.setItem("playerPosition", result.toString());
    } catch (error) {
      console.error("Error reading from contract:", error);
    }
  };

  const movePlayerStepByStep = (totalSteps) => {
    setIsMoving(true);
    let currentStep = 0;

    const moveInterval = setInterval(() => {
      if (currentStep < totalSteps) {
        const newLocation =
          (playerLocation + currentStep + 1) % monopolyLocations.length;

        setPlayerLocation(newLocation);

        if (playerMarkerRef.current) {
          playerMarkerRef.current.setLngLat(
            monopolyLocations[newLocation].coordinates
          );
        }

        currentStep++;
      } else {
        clearInterval(moveInterval);
        setIsMoving(false);
        setIsMakeMoveActive(false);
      }
    }, 500);
  };

  const rollDice = () => {
    if (isMoving || isLoading) return;

    const diceRoll = Math.floor(Math.random() * 7) + 1;

    // movePlayerStepByStep(diceRoll);
    setCard();
    nextMove(diceRoll);
  };

  const nextMove = async (diceRoll) => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const wallet = accounts[0];
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, contractABI, signer);

      console.log("wallet", wallet, "contract", contract);
      if (!wallet || !contract) {
        console.log("Please connect wallet first!");
        return;
      }

      setIsLoadingCard(true); // Show loading when waiting for transaction

      const tx = await contract.nextMove(wallet);
      await tx.wait();

      setIsLoadingCard(false); // Stop loading once transaction is completed
      movePlayerStepByStep(diceRoll);
      setIsMakeMoveActive(true); // Enable Make Move again after the transaction is completed
      setShowCardDetails(true);
      console.log("Player next move successfully!");
    } catch (error) {
      console.error("Next move failed:", error);
      setIsLoadingCard(false);
    }
  };

  useEffect(() => {
    setCard(carddata.cards[pos]);
    readPosition();
  }, [pos]);

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

  useEffect(() => {
    const intervalId = setInterval(() => {
      const updatedCurrency =
        parseInt(localStorage.getItem("playerCurrency"), 10) || 0;
      setPlayerCurrency(updatedCurrency);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className="relative w-full h-screen bg-cover bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('/images/galaxy.jpg')" }}
    >
      {isLoading && <GameLoader />}

      <div
        id="map"
        style={{ height: "100%", width: "100%" }}
        ref={mapContainerRef}
      />

      <GameTokenDisplay />

      <BankSectionToggle
        showLoanCard={showLoanCard}
        setShowLoanCard={setShowLoanCard}
      />

      {showLoanCard && playerCurrency <= 500 && (
        <LoanCard loan={loan} handleLoanClick={() => setShowLoanCard(false)} />
      )}

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
              {pos ? pos : 0}
            </span>
            <span className="block text-sm text-gray-300 mt-1">Position</span>
          </div>
        </div>
      </div>

      <div
        className="explore"
        style={{
          position: "absolute",
          bottom: "40px",
          right: "20px",
          padding: "10px",
          borderRadius: "5px",
          fontSize: "16px",
        }}
        onClick={rollDice}
      >
        {isLoadingCard || isMoving ? "MOVING..." : "MAKE MOVE"}
      </div>
      {showCardDetails && (
        <div
          style={{
            position: "absolute",
            bottom: "450px",
            right: "250px",
          }}
        >
          <div
            style={{ backgroundImage: `url(${card?.image})` }}
            className="bg-cover bg-center w-60 h-80 bg-neutral-800 rounded-3xl text-neutral-300 p-4 flex flex-col items-start justify-center gap-3 hover:bg-gray-900 hover:shadow-2xl hover:shadow-sky-400 transition-shadow absolute"
          >
            <div className="absolute bottom-0 left-0 w-full bg-opacity-60 p-3 rounded-b-3xl">
              <p className="font-extrabold text-white">{card?.name}</p>
              <p className="text-neutral-300">{card?.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
