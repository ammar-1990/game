import { GameState, useGameContext } from "@/contexts/game-context";
import { useSocket } from "@/contexts/socket-io.context";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const useMainHook = () => {
  const [inputValue, setInputValue] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [points, setPoints] = useState(100);
  const [multiplier, setMultiplier] = useState(1.25);
  const [speed, setSpeed] = useState(3);
 const [result, setResult] = useState<number | undefined>(undefined)
 const [loading, setLoading] = useState(false)
 const[hide,setHide] = useState(false)

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
    if(!points || !multiplier){
      toast.error('points and multiplier are required')
      return
    }

    if(multiplier > 5) {
      toast.error('Multiplier should be less or equal to 5')
      return
    }

    if(multiplier < 1){
      toast.error("Multiplier should be atleast 1")
      return
    }
    if(player?.points && points > player?.points){
      toast.error("you don't have this amount of points")
      return
    }
    if (emitEvent) {
      emitEvent("makePrediction", { points, multiplier,speed })
      setLoading(true)
      setHide(true)
      setTimeout(()=>setHide(false),0)
    };
  }

  useEffect(() => {
    if (!socket) return;

    socket.on("playerJoined", (data) => {
      toast.info(`${JSON.parse(data).name} has joined`);
    });

    socket.on("joinSuccess", (player) => {
  
      dispatch({
        type: "SET_LOGGED",
        payload: JSON.parse(player) as GameState["player"],
      });
    });

    socket.on("gameUpdate", (data) => {
      console.log("gameUpdate",JSON.parse(data))
      dispatch({ type: "SET_PLAYERS", payload: JSON.parse(data).players });
      dispatch({ type: "SET_ROUND", payload: JSON.parse(data).round });

      dispatch({ type: "ADD_CHAT_MESSAGES", payload: JSON.parse(data).messages });
    });

    socket.on("putPrediction",(data)=>{
    
      dispatch({ type: "SET_PLAYERS", payload: data.players })
    })
    socket.on("multiplierUpdate",(data)=>{
     
    setResult(data)
    })

    socket.on("chatMessage", (message) => {
      console.log(message)
      dispatch({ type: "ADD_CHAT_MESSAGE", payload: JSON.parse(message) });
      scroller?.current?.scrollIntoView({ behavior: "smooth" });
    });
    socket.on("playerUpdate", (data) => {
    console.log("updated player",data)
      dispatch({ type: "SET_LOGGED", payload: data });
  
    });
    socket.on("roundEnd", (data) => {
      console.log("endRound",data)
      dispatch({ type: "SET_PLAYERS", payload: data.players });
      dispatch({ type: "SET_ROUND", payload: data.round });
    setLoading(false)

  
    });

    return () => {
      socket.off("gameUpdate");
      socket.off("chatMessage");
      socket.off("playerJoined");
      socket.off("joinSuccess");
      socket.off("putPrediction");
      socket.off("multiplierUpdate");
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
    result,
    loading,
    hide
  };
};
