"use client";

import { Input } from "@/components/ui/input";
import { useMainHook } from "../hooks/main-hook";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Clock, MessageCircle, Trophy, User, UserRound } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useGameContext } from "@/contexts/game-context";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
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
  } = useMainHook();

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
          multiplier={multiplier}
          points={points}
          speed={speed}
          setMultiplier={setMultiplier}
          setPoints={setPoints}
          setSpeed={setSpeed}
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
        <div className="border rounded-md p-4 mt-4 bg-slate-800 border-gray-700 flex-1"></div>
      </article>

      {/* end */}
      <section className="col-span-3 grid grid-cols-11 gap-3 border-gray-700 rounded-md min-h-[200px] mt-3">
        {/* left  rank*/}
        <article className="col-span-6 flex flex-col">
          <span className="flex items-center gap-3 text-sm text-white font-semibold">
            <Trophy size={13} /> Ranking
          </span>
          <div className="border-gray-700 rounded-md border p-3 mt-1 flex-1"></div>
        </article>

        {/* right chat */}
        <article className="col-span-5  flex flex-col">
          <span className="flex items-center gap-3 text-sm text-white font-semibold">
            <MessageCircle size={13} /> Chat
          </span>
          <div className="border-gray-700 rounded-md border p-3 mt-1 flex-1 flex flex-col">
            {/* chat content */}
            <div className="h-[200px] flex flex-col gap-1 overflow-y-auto    mb-2 ">
              {chat.map((message) => (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
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
  speed
}: {
  points: number;
  setPoints:Dispatch<SetStateAction<number>>;
  multiplier: number;
  setMultiplier:Dispatch<SetStateAction<number>>;
  speed: number;
  setSpeed:Dispatch<SetStateAction<number>>;
}) => {
  return <article className="col-span-1 p-3 border border-gray-700 rounded-md bg-slate-800">
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
       title="Multiplier"
      value={multiplier}
      setValue={setMultiplier}

/>
      </div>
      
      <Button className="text-white bg-gradient-to-tr from-pink-600 to-orange-600 w-full mt-3 hover:opacity-90 transition">Start</Button>

    </div>
  </article>;
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



const ControlComponent = ({value,setValue,title}:{value:number,setValue:Dispatch<SetStateAction<number>>,title:string})=>{
  return (
    <div className="rounded-lg border-gray-700 p-2 flex-1  border bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center">
    <span className="text-[7px] text-white">{title}</span>
    
    <div className="flex items-center gap-2 w-full mt-3">
    <Button className="bg-transparent   w-6 h-6 border-gray-700 border text-gray-300 hover:text-gray-950" onClick={()=>{
     
      setValue(prev=>prev+1)}} 
      
      variant={'secondary'} size={'icon'}><ChevronUp/></Button>
   <Input className="h-auto bg-gray-950 text-white border-none" type="number" value={value} onChange={(e)=>setValue(+e.target.value)} />
    <Button className="bg-transparent  w-6 h-6  border-gray-700 border text-gray-300 hover:text-gray-950" onClick={()=>{
      if(value===0) return
      setValue(prev=>prev-1)}} variant={'secondary'} size={'icon'}><ChevronDown /></Button>
    </div>
    
          </div>
  )
}
