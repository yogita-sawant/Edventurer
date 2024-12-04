import { useState, useEffect } from "react";

const CardDetailsModal = ({ card, showCardDetails, showMintCard }) => {
  console.log("showMintCard", card);
  const [randomIndex, setRandomIndex] = useState(null);

  useEffect(() => {
    if (card && card.length > 0) {
      const randomNum = Math.floor(Math.random() * card.length);
      setRandomIndex(randomNum);
    }
  }, [card]);

  if (randomIndex === null || !card || card.length === 0) return null;

  const selectedCard = card[randomIndex];

  return (
    <>
      {showMintCard && selectedCard && (
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
      )}
    </>
  );
};

export default CardDetailsModal;
