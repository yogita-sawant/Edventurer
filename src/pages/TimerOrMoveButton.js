import React, { useState, useEffect } from "react";

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

    const diceRoll = Math.floor(Math.random() * 6) + 1;

    movePlayerStepByStep(diceRoll);

    setTimerRemainingTime(6);
    setIsTimerActive(true);
  };

  // Handle the timer countdown
  useEffect(() => {
    if (!isTimerActive) return;

    const countdownInterval = setInterval(() => {
      setTimerRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(countdownInterval);
          setIsTimerActive(false);
          setHasMoved(false);
          setIsMakeMoveActive(true);
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
