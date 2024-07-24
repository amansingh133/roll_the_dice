import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:8080";

const players = [
  { id: 0, name: "Player 1" },
  { id: 1, name: "Player 2" },
  { id: 2, name: "Player 3" },
  { id: 3, name: "Player 4" },
];

const sockets = players.map((player) => io(SERVER_URL));

// Function to simulate players joining
const joinPlayers = () => {
  sockets.forEach((socket, index) => {
    socket.emit("join", players[index]);
  });
};

// Function to get joined players
const getJoinedPlayers = () => {
  sockets[0].emit("joined");
};

// Function to simulate rolling dice
const rollDice = (playerId) => {
  const player = players.find((p) => p.id === playerId);
  sockets[playerId].emit("rollDice", player);
};

// Function to restart the game
const restartGame = () => {
  sockets[0].emit("restart");
};

// Listen for events
sockets.forEach((socket, index) => {
  socket.on("join", (data) => {
    console.log(`Player ${data.name} has joined the game`);
  });

  socket.on("joined", (data) => {
    console.log("Players in the game:", data);
  });

  socket.on("rollDice", (data, turn) => {
    console.log(
      `Player ${data.name} rolled the dice. Next turn: Player ${turn}`
    );
  });

  socket.on("restart", () => {
    console.log("Game has been restarted");
  });

  socket.on("connect", () => {
    console.log(`Player ${index + 1} connected`);
  });

  socket.on("disconnect", () => {
    console.log(`Player ${index + 1} disconnected`);
  });
});

// Simulate the game flow
const simulateGame = async () => {
  // Players join
  joinPlayers();

  // Wait a bit for the players to join
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Get the list of joined players
  getJoinedPlayers();

  // Wait a bit
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate dice rolls
  rollDice(0);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  rollDice(1);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  rollDice(2);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  rollDice(3);

  // Wait a bit
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Restart the game
  restartGame();
};

simulateGame();
