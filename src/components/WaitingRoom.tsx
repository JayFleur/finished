import React, { useState, useEffect } from 'react';
import { Copy } from 'lucide-react';

type WaitingRoomProps = {
  playerNumber: number;
  link: string;
};

const WaitingRoom: React.FC<WaitingRoomProps> = ({ playerNumber, link }) => {
  const [showNotification, setShowNotification] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setShowNotification(true);
  };

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative">
      <h2 className="text-2xl font-bold mb-4">Waiting Room</h2>
      <p className="mb-4">Waiting for Player {playerNumber} to submit their decks...</p>
      <div className="bg-gray-700 p-4 rounded mb-4">
        <h3 className="text-lg font-semibold mb-2">Share with Player {playerNumber}</h3>
        <p className="text-sm mb-2">Use this link to invite Player {playerNumber} to the game:</p>
        <div className="flex items-center bg-gray-600 rounded overflow-hidden">
          <input
            type="text"
            value={link}
            readOnly
            className="flex-grow bg-transparent p-2 text-sm"
          />
          <button
            onClick={handleCopy}
            className="bg-blue-600 hover:bg-blue-700 p-2"
            title="Copy link"
          >
            <Copy size={20} />
          </button>
        </div>
      </div>
      {showNotification && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-300">
          URL copied to clipboard!
        </div>
      )}
    </div>
  );
};

export default WaitingRoom;