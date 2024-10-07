import React from 'react';

type BanPhaseProps = {
  decks: [string, string, string];
  onBan: (deck: string) => void;
  bannedDeck: string;
  isWaiting: boolean;
};

const BanPhase: React.FC<BanPhaseProps> = ({ decks, onBan, bannedDeck, isWaiting }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Ban Phase</h2>
      {isWaiting ? (
        <p className="mb-4">Waiting for the other player to select their ban...</p>
      ) : bannedDeck ? (
        <p className="mb-4">You have banned: <span className="font-bold">{bannedDeck}</span></p>
      ) : (
        <p className="mb-4">Select one of your opponent's decks to ban:</p>
      )}
      <div className="space-y-3">
        {decks.map((deck, index) => (
          <button
            key={index}
            onClick={() => onBan(deck)}
            className={`w-full font-bold py-2 px-4 rounded ${
              bannedDeck || isWaiting
                ? deck === bannedDeck
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
            disabled={!!bannedDeck || isWaiting}
          >
            {deck}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BanPhase;