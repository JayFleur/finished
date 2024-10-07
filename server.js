import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const games = new Map();

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('createGame', () => {
    const gameId = Math.random().toString(36).substr(2, 9);
    games.set(gameId, {
      player1: socket.id,
      player2: null,
      state: 'player1Submit',
      player1Decks: ['', '', ''],
      player2Decks: ['', '', ''],
      player1BannedDeck: '',
      player2BannedDeck: ''
    });
    socket.join(gameId);
    socket.emit('gameCreated', gameId);
  });

  socket.on('joinGame', (gameId) => {
    const game = games.get(gameId);
    if (game && !game.player2) {
      game.player2 = socket.id;
      socket.join(gameId);
      socket.emit('gameJoined', gameId);
      io.to(gameId).emit('updateGameState', game);
    } else {
      socket.emit('error', 'Game not found or already full');
    }
  });

  socket.on('submitDecks', ({ gameId, playerNumber, decks }) => {
    const game = games.get(gameId);
    if (game) {
      if (playerNumber === 1) {
        game.player1Decks = decks;
        game.state = 'player2Submit';
      } else {
        game.player2Decks = decks;
        game.state = 'bothBan';
      }
      io.to(gameId).emit('updateGameState', game);
    }
  });

  socket.on('banDeck', ({ gameId, playerNumber, deck }) => {
    const game = games.get(gameId);
    if (game) {
      if (playerNumber === 1) {
        game.player1BannedDeck = deck;
      } else {
        game.player2BannedDeck = deck;
      }
      if (game.player1BannedDeck && game.player2BannedDeck) {
        game.state = 'results';
      }
      io.to(gameId).emit('updateGameState', game);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    // Handle game cleanup if a player disconnects
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Serve static files from the 'dist' directory
app.use(express.static(join(__dirname, 'dist')));

// For any other routes, serve the index.html file
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});