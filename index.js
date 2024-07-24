import express from "express";
import { createServer } from "http";
import configureSocket from "./config/socket.js";
import handleConnection from "./events/connectionHandler.js";

const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.static("public"));

const server = createServer(app);

const io = configureSocket(server);

io.on("connection", (socket) => {
  handleConnection(socket, io);
});

server.listen(PORT, () => {
  console.log(`Server running on PORT : ${PORT}`);
});
