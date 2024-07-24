import { Server } from "socket.io";

const configureSocket = (server) => {
  const io = new Server(server, {
    cors: "*",
  });
  return io;
};

export default configureSocket;
