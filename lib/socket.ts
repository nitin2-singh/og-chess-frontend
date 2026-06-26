"use client";

import { io, Socket } from "socket.io-client";
import { cookies } from "./cookie";

let socket: Socket | null = null;

export const getSocket = () => {
  if (socket) return socket;

  const token = cookies.getAccessToken();

  socket = io(process.env.NEXT_PUBLIC_API_URL!, {
    transports: ["websocket"],
    auth: {
      token,
    },
  });

  return socket;
};
