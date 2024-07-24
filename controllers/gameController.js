let users = [];
let playerTurns = {};

const joinGame = (data, io) => {
  console.log("player joined");
  users.push(data);
  playerTurns[data.id] = [];
  io.sockets.emit("join", data);
};

const getJoinedUsers = (socket) => {
  console.log("Sending all joined users");
  socket.emit("joined", users);
};

const rollDice = (data, io) => {
  console.log("Dice rolled");
  const player = users.find((user) => user.id === data.id);
  player.total = data.total;
  player.turns = data.turns;
  playerTurns[data.id].push(data.num);

  const allFinished = users.every((user) => user.turns === 4);
  const turn = (data.id + 1) % users.length;

  io.sockets.emit("rollDice", data);

  if (allFinished) {
    const winner = users.reduce((max, user) =>
      user.total > max.total ? user : max
    );
    io.sockets.emit("gameOver", { winner });
  } else {
    io.sockets.emit("nextTurn", { turn });
  }
};

const restartGame = (io) => {
  console.log("Game restarted");
  users = [];
  playerTurns = {};
  io.sockets.emit("restart");
};

export { joinGame, getJoinedUsers, rollDice, restartGame };
