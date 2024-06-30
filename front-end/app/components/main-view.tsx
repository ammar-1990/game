"use client";

import { Input } from "@/components/ui/input";
import { useMainHook } from "../hooks/main-hook";
import { Button } from "@/components/ui/button";
import { ChartData, ChartOptions } from 'chart.js';
import {
  ChevronDown,
  ChevronUp,
  Clock,
  MessageCircle,
  Trophy,
  User,
  UserRound,
} from "lucide-react";
import { Dispatch, SetStateAction, useMemo } from "react";
import { useGameContext } from "@/contexts/game-context";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import IndicatorChart from "./Indicator";
type Props = {};

const MainView = (props: Props) => {
  const {
    dispatch,
    socket,
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
    multiplier,
    points,
    setMultiplier,
    setPoints,
    setSpeed,
    speed,
    handleSendPrediction,
    result,
    loading,
    hide

  } = useMainHook();
  const {
    state: { players },
  } = useGameContext();
  const sortedPlayers = useMemo(() => {
    if (!players.every((el) => el.prediction)) return players;
    return players.sort((a, b) => {
      if (a.prediction.win && b.prediction.win) {
        return (
          b.prediction.predictedMultiplier * b.prediction.pointsPlaced -
          a.prediction.predictedMultiplier * a.prediction.pointsPlaced
        );
      }
      if (a.prediction.win) return -1;
      if (b.prediction.win) return 1;
      return 0;
    });
  }, [players]);

  const data: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        label: 'Multiplier',
        data: [],
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      x: {
        display: false,
      },
    },
  };
  return (
    <div className="grid grid-cols-3 gap-3  ">
      {/* left */}
      {!player ? (
        <LeftComponent
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleJoin={handleJoin}
        />
      ) : (
        <LeftLoginComponent
          handleSendPrediction={handleSendPrediction}
          multiplier={multiplier}
          points={points}
          speed={speed}
          setMultiplier={setMultiplier}
          setPoints={setPoints}
          setSpeed={setSpeed}
          loading={loading}
        />
      )}

      {/* right */}
      <article className="col-span-2  flex flex-col min-h-[350px]">
        {/* top */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 border border-gray-700 rounded-md bg-slate-800 min-h-[70px] flex items-center justify-center">
            {player && (
              <span className="flex items-center gap-3 justify-center">
                <Trophy className="text-orange-500 fill-orange-500" />
                <span className="text-lg font-bold text-white">
                  {player.points}
                </span>
              </span>
            )}
          </div>
          <div className="p-3 border  border-gray-700 rounded-md bg-slate-800 min-h-[70px] flex items-center justify-center">
            {player && (
              <span className="flex items-center gap-3 justify-center">
                <UserRound className="text-indigo-500 fill-indigo-500  " />
                <span className="text-lg font-bold text-white capitalize">
                  {player.name}
                </span>
              </span>
            )}
          </div>
          <div className="p-3 border border-gray-700 rounded-md bg-slate-800 min-h-[70px] flex items-center justify-center">
            {player && (
              <span className="flex items-center gap-3 justify-center">
                <Clock className="text-gray-500   " />
                <span className="text-lg font-bold text-white capitalize">
                  {time}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* bottom */}
        <div className="border rounded-md p-4 mt-4 relative bg-slate-800 border-gray-700 flex-1 text-white flex items-center justify-center font-bold">
          {result && <IndicatorChart multiplier={result}  hide={hide}/>}
          {!!result && (
            <span className="text-5xl font-bold absolute inset-0 top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%] h-fit block text-center min-w-[100px] px-20 bg-gradient-to-tr from-pink-400 to-orange-500 text-transparent bg-clip-text [textShadow:2px_2px_1px_white]">
              {" "}
              {Number(result).toFixed(2)}x
            </span>
          )}
        </div>
      </article>

      {/* end */}
      <section className="col-span-3 grid grid-cols-11 gap-3 border-gray-700 rounded-md min-h-[200px] mt-3">
        {/* left  rank*/}
        <article className="col-span-6 flex flex-col">
          <span className="flex items-center gap-3 text-sm text-white font-semibold">
            <Trophy size={13} /> Ranking
          </span>
          <div className="border-gray-700 rounded-xl border overflow-hidden mt-3  ">
            <div className="grid grid-cols-3 gap-1 py-1 bg-gray-800">
              <span className="justify-self-center text-xs text-white font-semibold ">
                No
              </span>
              <span className="justify-self-center text-xs text-white font-semibold ">
                Name
              </span>
              <span className="justify-self-center text-xs text-white font-semibold ">
                Score
              </span>
            </div>
            {!!sortedPlayers.length
              ? players.map((player, i) => (
                  <div
                    key={player?.id}
                    className={cn(
                      "grid grid-cols-3 gap-1 py-2",
                      i % 2 === 0 ? "bg-slate-600" : "bg-slate-700"
                    )}
                  >
                    <span className="justify-self-center text-white text-xs">
                      {i + 1}
                    </span>
                    <span className="justify-self-center text-white text-xs">
                      {player?.name}
                    </span>
                    <span className={cn("justify-self-center text-white text-xs")}>
                      {player.prediction?.win === true
                        ? (
                            player.prediction?.pointsPlaced *
                            player.prediction?.predictedMultiplier
                          ).toFixed(0)
                        : player.prediction?.win === false
                        ? "0"
                        : player.prediction?.pointsPlaced}
                    </span>
                  </div>
                ))
              : Array(5)
                  .fill("")
                  .map((_, index) => (
                    <div
                      key={`players-${index}`}
                      className="grid grid-cols-3 gap-1"
                    >
                      <span className="justify-self-center text-white">-</span>
                      <span className="justify-self-center text-white">-</span>
                      <span className="justify-self-center text-white">-</span>
                    </div>
                  ))}
          </div>
        </article>

        {/* right chat */}
        <article className="col-span-5  flex flex-col">
          <span className="flex items-center gap-3 text-sm text-white font-semibold">
            <MessageCircle size={13} /> Chat
          </span>
          <div className="border-gray-700 rounded-md border p-3 mt-1 flex-1 flex flex-col">
            {/* chat content */}
            <div className="min-h-[100px] flex flex-col gap-1 overflow-y-auto    mb-2 ">
              {chat.map((message, i) => (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    transition: {
                      delay: message.player.id.startsWith("Bot") ? i * 0.5 : 0,
                    },
                  }}
                  key={message.player.id}
                  className="flex items-center gap-3"
                >
                  <span
                    className={cn(
                      " rounded-sm   text-xs capitalize",
                      generateColor(message.player.id)
                    )}
                  >
                    {message.player.name}:
                  </span>
                  <p className="text-[10px] text-white first-letter:capitalize px-1 py-px rounded-sm bg-muted-foreground">
                    {message.content}
                  </p>
                </motion.div>
              ))}
              <div className="py-3" ref={scroller} />
            </div>
            {/* chat input */}
            <div className="mt-auto">
              <ChatInput
                handleMessage={handleMessage}
                setChatInput={setChatInput}
                chatInput={chatInput}
              />
            </div>
          </div>
        </article>
      </section>
    </div>
  );
};

export default MainView;

const LeftComponent = ({
  inputValue,
  setInputValue,
  handleJoin,
}: {
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  handleJoin: (name: string) => void;
}) => {
  return (
    <article className="col-span-1 p-3 border border-gray-700 rounded-md bg-slate-800">
      <h3 className="text-gray-200 text-xl font-semibold text-center">
        Welcome
      </h3>

      <span className="text-xs text-gray-400  w-fit block mx-auto mt-24">
        Please Insert Your Name
      </span>
      <Input
        onKeyDown={(e) => {
          if (e.key === "Enter" && inputValue) {
            handleJoin(inputValue);
            setInputValue("");
          }
        }}
        className="text-gray-300 bg-gray-900 border-gray-700 focus-visible:border-gray-200 transition mt-4"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Button
        disabled={!inputValue}
        onClick={() => handleJoin(inputValue)}
        className="w-full mt-3 "
      >
        Accept
      </Button>
    </article>
  );
};

const LeftLoginComponent = ({
  points,
  multiplier,
  setMultiplier,
  setPoints,
  setSpeed,
  speed,
  handleSendPrediction,
  loading,
}: {
  points: number;
  setPoints: Dispatch<SetStateAction<number>>;
  multiplier: number;
  setMultiplier: Dispatch<SetStateAction<number>>;
  speed: number;
  setSpeed: Dispatch<SetStateAction<number>>;
  handleSendPrediction: () => void;
  loading: boolean;
}) => {
  const {
    state: { players },
  } = useGameContext();
  return (
    <article className="col-span-1 p-3  ">
      {/* top */}

      <div className="">
        <div className="flex items-center gap-3 ">
          {/* Points */}
          <ControlComponent
            title="Points"
            value={points}
            setValue={setPoints}
          />

          {/* Multiplier */}
          <ControlComponent
            multiplier
            title="Multiplier"
            value={multiplier}
            setValue={setMultiplier}
          />
        </div>

        <Button
          disabled={loading}
          onClick={handleSendPrediction}
          className="text-white bg-gradient-to-tr from-pink-600 to-orange-600 w-full mt-3 hover:opacity-90 transition"
        >
          Start
        </Button>
      </div>
      {/* statistics */}
      <div className="mt-4">
        <span className="flex items-center gap-2 text-white font-bold">
          <Trophy fill="white" /> Current Round
        </span>
        <div className="border-gray-700 rounded-xl border overflow-hidden mt-3">
          <div className="grid grid-cols-3 gap-1 py-1 bg-gray-800">
            <span className="justify-self-center text-xs text-white font-semibold ">
              Name
            </span>
            <span className="justify-self-center text-xs text-white font-semibold ">
              Points
            </span>
            <span className="justify-self-center text-xs text-white font-semibold ">
              Multiplier
            </span>
          </div>
          {!!players.length
            ? players.map((player, i) => (
                <div
                  key={player?.id}
                  className={cn(
                    "grid grid-cols-3 gap-1",
                    i % 2 === 0 ? "bg-slate-600" : "bg-slate-700"
                  )}
                >
                  <span
                    className={cn(
                      "justify-self-center text-white text-[10px] py-1",
                      !player.prediction
                        ? "text-white"
                        : player.prediction.win === true
                        ? "text-green-600"
                        : !loading
                        ? "text-rose-500"
                        : "text-white"
                    )}
                  >
                    {player?.name}
                  </span>
                  <span
                    className={cn(
                      "justify-self-center text-white text-[10px] py-1",
                      !player.prediction
                        ? "text-white"
                        : player.prediction.win === true
                        ? "text-green-600"
                        : !loading
                        ? "text-rose-500"
                        : "text-white"
                    )}
                  >
                    {player.prediction?.win === true
                      ? (
                          player.prediction?.pointsPlaced *
                          player.prediction?.predictedMultiplier
                        ).toFixed(0)
                      : player.prediction?.win === false
                      ? "0"
                      : player.prediction?.pointsPlaced}
                  </span>
                  <span
                    className={cn(
                      "justify-self-center text-white text-[10px] py-1",
                      !player.prediction
                        ? "text-white"
                        : player.prediction.win === true
                        ? "text-green-600"
                        : !loading
                        ? "text-rose-500"
                        : "text-white"
                    )}
                  >
                    {player?.prediction?.predictedMultiplier || "-"}
                  </span>
                </div>
              ))
            : Array(5)
                .fill("")
                .map((_, index) => (
                  <div
                    key={`players-${index}`}
                    className="grid grid-cols-3 gap-1"
                  >
                    <span>-</span>
                    <span>-</span>
                    <span>-</span>
                  </div>
                ))}
        </div>
      </div>
      {/* Speed */}

      <div className="mt-4">
        <span className="flex items-center gap-2 text-white font-bold">
          Speed {speed}
        </span>
        <div className="p-3 rounded-lg border border-gray-700">
          <Input
            type="range"
            step={1}
            max={5}
            min={1}
            className="w-full"
            value={speed}
            onChange={(e) => setSpeed(+e.target.value)}
          />
          <span className="flex items-center justify-between px-2 mt-2">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <span className={cn("text-xs text-white ")} key={i}>
                  {i + 1}x
                </span>
              ))}
          </span>
        </div>
      </div>
    </article>
  );
};

const ChatInput = ({
  chatInput,
  setChatInput,
  handleMessage,
}: {
  chatInput: string;
  setChatInput: (value: string) => void;
  handleMessage: (value: string) => void;
}) => {
  const {
    state: { player },
  } = useGameContext();
  return (
    <div className="flex items-center gap-3">
      <Input
        onKeyDown={(e) => {
          if (e.key === "Enter" && chatInput && player) {
            handleMessage(chatInput);
            setChatInput("");
          }
        }}
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
        className="flex-1 text-gray-300 bg-gray-900 border-gray-700 focus-visible:border-gray-200 transition"
      />
      <Button
        disabled={!player}
        onClick={() => {
          handleMessage(chatInput);
          setChatInput("");
        }}
        className="text-white bg-gradient-to-tr from-pink-600 to-orange-600 hover:opacity-90 transition"
      >
        Start
      </Button>
    </div>
  );
};

const ControlComponent = ({
  value,
  setValue,
  title,
  multiplier,
}: {
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
  title: string;
  multiplier?: boolean;
}) => {
  return (
    <div className="rounded-lg border-gray-700 p-2 flex-1  border bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center">
      <span className="text-[7px] text-white">{title}</span>

      <div className="flex items-center gap-2 w-full mt-3">
        <Button
          className="bg-transparent   w-6 h-6 border-gray-700 border text-gray-300 hover:text-gray-950"
          onClick={() => {
            setValue((prev) => prev + (multiplier ? 0.25 : 1));
          }}
          variant={"secondary"}
          size={"icon"}
        >
          <ChevronUp />
        </Button>
        <Input
          className="h-auto bg-gray-950 text-white border-none"
          type="number"
          value={value}
          onChange={(e) => setValue(+e.target.value)}
        />
        <Button
          className="bg-transparent  w-6 h-6  border-gray-700 border text-gray-300 hover:text-gray-950"
          onClick={() => {
            if (value === 0) return;
            setValue((prev) => prev - (multiplier ? 0.25 : 1));
          }}
          variant={"secondary"}
          size={"icon"}
        >
          <ChevronDown />
        </Button>
      </div>
    </div>
  );
};
