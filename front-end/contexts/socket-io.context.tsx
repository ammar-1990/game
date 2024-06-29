'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';


type SocketContext = {
  socket: Socket | null;
  emitEvent: (event: string, data: any) => void
}
const SocketContext = createContext<SocketContext | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [socket, setSocket] = useState<Socket | null>(null);

  const emitEvent = (event: string, data: any) => {
    if (socket) {
     
      socket.emit(event, data);
      console.log(`Event sent: ${event}`, data)
    }
  };

  useEffect(() => {
    const newSocket = io('http://localhost:4000');
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{socket,emitEvent}}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
