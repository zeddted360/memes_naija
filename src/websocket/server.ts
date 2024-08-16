import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();

const socket = new Server(httpServer, {});

socket.on("connection", (socket) => {
  console.log("the socket is ", socket);
});

httpServer.listen(4000, () => {
  console.log("server connected");
});
