import { useState, useEffect } from "react";

const CardDetailsModal = ({ card, showCardDetails, showMintCard }) => {
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (card && card.length > 0) {
        const storedNumber = parseInt(
          localStorage.getItem("playerPosition"),
          10
        );

        if (
          !isNaN(storedNumber) &&
          storedNumber >= 0 &&
          storedNumber < card.length
        ) {
          setSelectedCard(card[storedNumber]);
        } else {
          setSelectedCard(null);
        }
      }
    }, 1000); // Check every 1 second

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [card]);

  if (!selectedCard || !showMintCard) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "450px",
        right: "250px",
      }}
    >
      <div
        style={{ backgroundImage: `url(${selectedCard.image})` }}
        className="bg-cover bg-center w-60 h-80 bg-neutral-800 rounded-3xl text-neutral-300 p-4 flex flex-col items-start justify-center gap-3 hover:bg-gray-900 hover:shadow-2xl hover:shadow-sky-400 transition-shadow absolute"
      >
        <div className="absolute bottom-0 left-0 w-full bg-opacity-60 p-3 rounded-b-3xl">
          <p className="font-extrabold text-white">{selectedCard.name}</p>
          <p className="text-neutral-300">{selectedCard.description}</p>
        </div>
      </div>
    </div>
  );
};

export default CardDetailsModal;
