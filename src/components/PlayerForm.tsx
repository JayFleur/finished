import React, { useState } from 'react';

type PlayerFormProps = {
  playerNumber: number;
  onSubmit: (decks: [string, string, string]) => void;
};

const PlayerForm: React.FC<PlayerFormProps> = ({ playerNumber, onSubmit }) => {
  const [decks, setDecks] = useState<[string, string, string]>(['', '', '']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (decks.every(deck => deck.trim() !== '')) {
      onSubmit(decks);
    }
  };

  const handleDeckChange = (index: number, value: string) => {
    const newDecks = [...decks] as [string, string, string];
    newDecks[index] = value;
    setDecks(newDecks);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Player {playerNumber}: Submit Your Decks</h2>
      <form onSubmit={handleSubmit}>
        {[0, 1, 2].map((index) => (
          <input
            key={index}
            type="text"
            value={decks[index]}
            onChange={(e) => handleDeckChange(index, e.target.value)}
            placeholder={`Deck ${index + 1}`}
            className="w-full bg-gray-700 text-white p-2 mb-3 rounded"
            required
          />
        ))}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit Decks
        </button>
      </form>
    </div>
  );
};

export default PlayerForm;