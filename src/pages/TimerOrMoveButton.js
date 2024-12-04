import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import contractABI from "./contractABI.json";
const CONTRACT_ADDRESS = "0xf5E491f0772d7dC4F9dF91d8BEC8642aB97b6De0";

const TimerOrMoveButton = ({
  monopolyLocations,
  playerLocation,
  setPlayerLocation,
  playerMarkerRef,
  isMakeMoveActive,
  setIsMakeMoveActive,
}) => {
  const [isMoving, setIsMoving] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerRemainingTime, setTimerRemainingTime] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
        setHasMoved(true);
        setIsMakeMoveActive(false);
      }
    }, 500);
  };

  const rollDice = () => {
    if (isMoving || isTimerActive) return;

    const diceRoll = Math.floor(Math.random() * 7) + 1;

    movePlayerStepByStep(diceRoll);

    setTimerRemainingTime(6);
    setIsTimerActive(true);
    nextMove();
  };

  const nextMove = async () => {
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

      setIsLoading(true);

      const tx = await contract.nextMove(wallet);
      await tx.wait();
      setIsMakeMoveActive(true);
      setIsTimerActive(false);
      setHasMoved(false);
      console.log("Player next move successfully!");
    } catch (error) {
      console.error("Next move failed:", error);
    }
  };

  useEffect(() => {
    if (!isTimerActive) return;

    const countdownInterval = setInterval(() => {
      setTimerRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(countdownInterval);
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [isTimerActive]);

  return (
    <>
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
        {isMoving
          ? "MOVING..."
          : isTimerActive
          ? `Next Chance In: ${timerRemainingTime}s`
          : isMakeMoveActive
          ? "MAKE MOVE"
          : "Wait for Next Move"}
      </div>
    </>
  );
};

export default TimerOrMoveButton;
