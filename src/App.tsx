import React, { useState, useEffect } from 'react';
import { Hexagon } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import PlayerForm from './components/PlayerForm';
import WaitingRoom from './components/WaitingRoom';
import BanPhase from './components/BanPhase';
import Results from './components/Results';

type GameState = 'player1Submit' | 'player2Submit' | 'bothBan' | 'results';
type PlayerDecks = [string, string, string];

interface GameData {
  state: GameState;
  player1Decks: PlayerDecks;
  player2Decks: PlayerDecks;
  player1BannedDeck: string;
  player2BannedDeck: string;
}

const App: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameData, setGameData] = useState<GameData>({
    state: 'player1Submit',
    player1Decks: ['', '', ''],
    player2Decks: ['', '', ''],
    player1BannedDeck: '',
    player2BannedDeck: '',
  });
  const [gameId, setGameId] = useState<string>('');
  const [isPlayer2, setIsPlayer2] = useState<boolean>(false);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    const params = new URLSearchParams(window.location.search);
    const id = params.get('gameId');

    if (id) {
      setGameId(id);
      setIsPlayer2(true);
      newSocket.emit('joinGame', id);
    } else {
      newSocket.emit('createGame');
    }

    newSocket.on('gameCreated', (id: string) => {
      setGameId(id);
    });

    newSocket.on('updateGameState', (newGameData: GameData) => {
      setGameData(newGameData);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handlePlayer1Submit = (decks: PlayerDecks) => {
    socket?.emit('submitDecks', { gameId, playerNumber: 1, decks });
  };

  const handlePlayer2Submit = (decks: PlayerDecks) => {
    socket?.emit('submitDecks', { gameId, playerNumber: 2, decks });
  };

  const handlePlayer1Ban = (deck: string) => {
    socket?.emit('banDeck', { gameId, playerNumber: 1, deck });
  };

  const handlePlayer2Ban = (deck: string) => {
    socket?.emit('banDeck', { gameId, playerNumber: 2, deck });
  };

  const getShareLink = () => {
    return `${window.location.origin}${window.location.pathname}?gameId=${gameId}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <header className="mb-8 flex items-center">
        <Hexagon className="w-8 h-8 mr-2" />
        <h1 className="text-3xl font-bold">Parallel Stats Ban Tool</h1>
      </header>
      {!isPlayer2 && gameData.state === 'player1Submit' && (
        <PlayerForm playerNumber={1} onSubmit={handlePlayer1Submit} />
      )}
      {!isPlayer2 && gameData.state === 'player2Submit' && (
        <WaitingRoom playerNumber={2} link={getShareLink()} />
      )}
      {isPlayer2 && gameData.state === 'player2Submit' && (
        <PlayerForm playerNumber={2} onSubmit={handlePlayer2Submit} />
      )}
      {!isPlayer2 && gameData.state === 'bothBan' && (
        <BanPhase
          decks={gameData.player2Decks}
          onBan={handlePlayer1Ban}
          bannedDeck={gameData.player1BannedDeck}
          isWaiting={!!gameData.player1BannedDeck && !gameData.player2BannedDeck}
        />
      )}
      {isPlayer2 && gameData.state === 'bothBan' && (
        <BanPhase
          decks={gameData.player1Decks}
          onBan={handlePlayer2Ban}
          bannedDeck={gameData.player2BannedDeck}
          isWaiting={!!gameData.player2BannedDeck && !gameData.player1BannedDeck}
        />
      )}
      {gameData.state === 'results' && (
        <Results 
          player1Decks={gameData.player1Decks} 
          player2Decks={gameData.player2Decks} 
          player1BannedDeck={gameData.player1BannedDeck}
          player2BannedDeck={gameData.player2BannedDeck}
        />
      )}
    </div>
  );
};

export default App;