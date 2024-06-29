import { GameState, useGameContext } from "@/contexts/game-context";
import { useSocket } from "@/contexts/socket-io.context";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const useMainHook = () => {
  const [inputValue, setInputValue] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [points, setPoints] = useState(0);
  const [multiplier, setMultiplier] = useState(0);
  const [speed, setSpeed] = useState(0);

  const [time, setTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setTime(`${hours}:${minutes}`);
    };

    updateClock(); // Initial call to set the time immediately
    const timerId = setInterval(updateClock, 60000); // Update every minute

    return () => clearInterval(timerId); // Clean up on component unmount
  }, []);

  const generateColor = (id: string) => {
    const colors = [
      "text-red-500",
      "text-blue-500",
      "text-green-500",
      "text-yellow-500",
      "text-indigo-500",
    ];
    const index = id.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const scroller = useRef<HTMLDivElement | null>(null);

  const { socket, emitEvent } = useSocket() || {};
  const {
    state: { chat, players, round, player },
    dispatch,
  } = useGameContext();

  const handleJoin = (name: string) => {
    if (name.trim() && emitEvent) {
      emitEvent("joinGame", { name });
    }
  };

  const handleMessage = (message: string) => {
    if (message.trim() && emitEvent) {
      emitEvent("sendMessage", message);
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("playerJoined", (data) => {
      toast.info(`${data.name} has joined`);
    });

    socket.on("joinSuccess", (player) => {
      console.log("player", player.player);
      dispatch({
        type: "SET_LOGGED",
        payload: player.player as GameState["player"],
      });
    });

    socket.on("gameUpdate", (data) => {
      dispatch({ type: "SET_PLAYERS", payload: data.players });
      dispatch({ type: "SET_ROUND", payload: data.round });
    });

    socket.on("chatMessage", (message) => {
      dispatch({ type: "ADD_CHAT_MESSAGE", payload: message });
      scroller?.current?.scrollIntoView({ behavior: "smooth" });
    });

    return () => {
      socket.off("gameUpdate");
      socket.off("chatMessage");
      socket.off("playerJoined");
      socket.off("joinSuccess");
    };
  }, [socket, dispatch]);

  return {
    socket,
    dispatch,
    inputValue,
    setInputValue,
    chatInput,
    setChatInput,
    handleJoin,
    chat,
    handleMessage,
    scroller,
    generateColor,
    player,
    time,
    points,
    setPoints,
    multiplier,
    setMultiplier,
    speed,
    setSpeed,
  };
};
