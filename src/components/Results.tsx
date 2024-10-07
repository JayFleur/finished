import React from 'react';

type ResultsProps = {
  player1Decks: [string, string, string];
  player2Decks: [string, string, string];
  player1BannedDeck: string;
  player2BannedDeck: string;
};

const Results: React.FC<ResultsProps> = ({ player1Decks, player2Decks, player1BannedDeck, player2BannedDeck }) => {
  console.log('Results component - Player 1 Banned Deck:', player1BannedDeck);
  console.log('Results component - Player 2 Banned Deck:', player2BannedDeck);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Results</h2>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Player 1 Decks:</h3>
        <ul className="list-disc list-inside">
          {player1Decks.map((deck, index) => (
            <li key={index} className={deck.trim() === player2BannedDeck.trim() ? 'line-through text-red-500' : ''}>
              {deck} {deck.trim() === player2BannedDeck.trim() && '(Banned by Player 2)'}
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Player 2 Decks:</h3>
        <ul className="list-disc list-inside">
          {player2Decks.map((deck, index) => (
            <li key={index} className={deck.trim() === player1BannedDeck.trim() ? 'line-through text-red-500' : ''}>
              {deck} {deck.trim() === player1BannedDeck.trim() && '(Banned by Player 1)'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Results;