import { ServerResponse } from "http";
import { io } from "socket.io-client";
const socket = io("http://localhost:55000");

socket.on("connect", (response:ServerResponse)=> {
  console.log(response);
});
