const socket = io.connect("http://localhost:8080");

socket.emit("joined");

let players = [];
let currentPlayer;

function rollDice() {
  return Math.ceil(Math.random() * 6);
}

document.getElementById("start-btn").addEventListener("click", () => {
  const name = document.getElementById("name").value;
  document.getElementById("name").disabled = true;
  document.getElementById("start-btn").hidden = true;
  document.getElementById("roll-button").hidden = false;
  currentPlayer = { id: players.length, name: name, total: 0, turns: 0 };
  socket.emit("join", currentPlayer);
});

document.getElementById("roll-button").addEventListener("click", () => {
  if (currentPlayer.turns < 4) {
    const num = rollDice();
    currentPlayer.total += num;
    currentPlayer.turns += 1;
    socket.emit("rollDice", {
      num: num,
      id: currentPlayer.id,
      total: currentPlayer.total,
      turns: currentPlayer.turns,
    });
  }

  if (currentPlayer.turns === 4) {
    document.getElementById("roll-button").hidden = true;
  }
});

document.getElementById("restart-btn").addEventListener("click", () => {
  socket.emit("restart");
});

socket.on("join", (data) => {
  players.push({
    id: data.id,
    name: data.name,
    total: data.total,
    turns: data.turns,
  });
  document.getElementById(
    "players-table"
  ).innerHTML += `<tr><td>${data.name}</td><td id="player-${data.id}-total">${data.total}</td></tr>`;
});

socket.on("joined", (data) => {
  data.forEach((player) => {
    players.push(player);
    document.getElementById(
      "players-table"
    ).innerHTML += `<tr><td>${player.name}</td><td id="player-${player.id}-total">${player.total}</td></tr>`;
  });
});

socket.on("rollDice", (data) => {
  document.getElementById("dice").src = `./images/dice/dice${data.num}.png`;
  document.getElementById(`player-${data.id}-total`).innerText = data.total;
});

socket.on("nextTurn", (data) => {
  const turn = data.turn;
  document.getElementById(
    "current-player"
  ).innerHTML = `<p>It's ${players[turn].name}'s turn</p>`;
  if (turn === currentPlayer.id) {
    document.getElementById("roll-button").hidden = false;
  }
});

socket.on("gameOver", (data) => {
  const winner = data.winner;
  document.getElementById(
    "current-player"
  ).innerHTML = `<p>${winner.name} has won with a total of ${winner.total}!</p>`;
  document.getElementById("restart-btn").hidden = false;
});

socket.on("restart", () => {
  window.location.reload();
});
