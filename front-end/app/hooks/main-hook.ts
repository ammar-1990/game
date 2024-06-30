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
      "text-purple-500",
      "text-pink-500",
      "text-teal-500",
      "text-orange-500",
      "text-gray-500",
    ];
    let hash = 0;

    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % colors.length;
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

  function handleSendPrediction() {
    if (emitEvent) emitEvent("makePrediction", { points, multiplier });
  }

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

      dispatch({ type: "ADD_CHAT_MESSAGES", payload: data.messages });
    });

    socket.on("putPrediction",(data)=>{
      console.log('predictiondata',data.players)
      dispatch({ type: "SET_PLAYERS", payload: data.players })
    })

    socket.on("chatMessage", (message) => {
      dispatch({ type: "ADD_CHAT_MESSAGE", payload: message });
      scroller?.current?.scrollIntoView({ behavior: "smooth" });
    });
    socket.on("playerUpdate", (data) => {
      console.log("new player",data)
      dispatch({ type: "SET_LOGGED", payload: data });
      scroller?.current?.scrollIntoView({ behavior: "smooth" });
    });

    return () => {
      socket.off("gameUpdate");
      socket.off("chatMessage");
      socket.off("playerJoined");
      socket.off("joinSuccess");
      socket.off("putPrediction");
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
    handleSendPrediction,
  };
};
