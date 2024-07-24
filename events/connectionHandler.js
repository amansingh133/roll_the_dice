import {
  joinGame,
  getJoinedUsers,
  rollDice,
  restartGame,
} from "../controllers/gameController.js";

const handleConnection = (socket, io) => {
  console.log("Made Socket Connection", socket.id);

  socket.on("join", (data) => joinGame(data, io));
  socket.on("joined", () => getJoinedUsers(socket));
  socket.on("rollDice", (data) => rollDice(data, io));
  socket.on("restart", () => restartGame(io));
};

export default handleConnection;
