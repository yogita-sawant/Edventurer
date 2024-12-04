import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import GameLoader from "./GameLoader";
import GameTokenDisplay from "./GameTokenDisplay";
import BankSectionToggle from "./BankSectionToggle";
import CardDetailsModal from "./CardDetailsModal";
import LoanCard from "./LoanCard";
import TimerOrMoveButton from "./TimerOrMoveButton";
import BalanceSection from "./BalanceSection";
import carddata from "../data/cards";
// import { BrowserProvider, Contract } from "ethers";
// import contractABI from "./contractABI.json";
// const CONTRACT_ADDRESS = "0x68cc57d9372a336e43d5aa2d275800775c38f404";

const DashboardPage = () => {
  const navigate = useNavigate();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const playerMarkerRef = useRef(null);

  const [playerLocation, setPlayerLocation] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [showMintCard, setShowMintCard] = useState(false);
  const [showLoanCard, setShowLoanCard] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [wallets, setWallets] = useState("");
  const [bal, setBal] = useState(0);
  const [pos, setPosition] = useState(0);
  const [loan, setLoanAmt] = useState(0);
  const [card, setCard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const monopolyLocations = carddata.cards;

  // Timer Effect
  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setShowMintCard(true);
    }
  }, [remainingTime]);
  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoibWltaW8iLCJhIjoiY2l6ZjJoenBvMDA4eDJxbWVkd2IzZjR0ZCJ9.ppwGNP_-LS2K4jUvgXG2pA";

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: monopolyLocations[playerLocation].coordinates,
      zoom: 16.5,
      pitch: 40,
      bearing: 53,
      style: "mapbox://styles/mapbox/standard",
      minZoom: 15,
      maxZoom: 17,
    });

    mapRef.current.on("load", () => {
      mapRef.current.setConfigProperty("basemap", "lightPreset", "dusk");

      mapRef.current.setConfigProperty("basemap", "showPlaceLabels", false);
      mapRef.current.setConfigProperty(
        "basemap",
        "showPointOfInterestLabels",
        false
      );
      mapRef.current.setLayoutProperty("poi-label", "visibility", "none");
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

  const [isMakeMoveActive, setIsMakeMoveActive] = useState(true);

  const handleMakeMoveStatus = (status) => {
    setIsMakeMoveActive(!status);
  };
  const handleLoanClick = () => {
    setShowLoanCard(!showLoanCard);
  };

  return (
    <div>
      {isLoading && <GameLoader />}

      <div
        id="map"
        style={{ height: "100vh", width: "100%" }}
        ref={mapContainerRef}
      />

      <GameTokenDisplay />

      <BankSectionToggle
        showLoanCard={showLoanCard}
        setShowLoanCard={setShowLoanCard}
      />

      {showLoanCard && (
        <LoanCard loan={loan} handleLoanClick={() => setShowLoanCard(false)} />
      )}

      <BalanceSection bal={bal} pos={pos} />

      <TimerOrMoveButton
        monopolyLocations={monopolyLocations}
        playerLocation={playerLocation}
        setPlayerLocation={setPlayerLocation}
        playerMarkerRef={playerMarkerRef}
        isMakeMoveActive={isMakeMoveActive}
        setIsMakeMoveActive={handleMakeMoveStatus}
      />
      {!isMakeMoveActive && (
        <CardDetailsModal
          card={carddata.cards}
          showCardDetails={showCardDetails}
          showMintCard={showMintCard}
        />
      )}

      {/* {walletAddress && (
        <div
          className="explore"
          style={{
            position: "absolute",
            top: "40px",
            right: "20px",
            padding: "10px",
            borderRadius: "5px",
            fontSize: "16px",
          }}
          onClick={registerPlayer}
        >
          Register Player
        </div>
      )} */}
    </div>
  );
};

export default DashboardPage;
