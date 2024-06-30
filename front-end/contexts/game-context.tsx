
'use client'
import React, { createContext, useContext, useReducer } from 'react';
type Player = {
  id: string,
  name: string,
  points: number,
}
type Prediction = {
  id:string,
  predictedMultiplier:number,
  pointsPlaced:number
}
export type GameState ={
  players: (Player &{prediction:Prediction} )[];
  round: any;
  chat: {content: string,
    player: Player,
    timestamp:Date}[];
    player:{id:string,name:string,points:number} | null
}

const initialState: GameState = {
  players: [],
  round: {},
  chat: [],
  player:null
};

type Action =
  | { type: 'SET_PLAYERS'; payload: any[] }
  | { type: 'SET_ROUND'; payload: any }
  | { type: 'ADD_CHAT_MESSAGE'; payload: any }
  | { type: 'ADD_CHAT_MESSAGES'; payload: any }
  |{type:'SET_LOGGED';payload:GameState['player']}

const GameContext = createContext<{ state: GameState; dispatch: React.Dispatch<Action> }>({
  state: initialState,
  dispatch: () => null,
});

const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'SET_PLAYERS':
      return { ...state, players: action.payload };
    case 'SET_ROUND':
      return { ...state, round: action.payload };
    case 'ADD_CHAT_MESSAGE':
      return { ...state, chat: [...state.chat, action.payload] };
    case 'ADD_CHAT_MESSAGES':
      return { ...state, chat: [...state.chat, ...action.payload] };
      case "SET_LOGGED":
        return {...state,player:action.payload}
    default:
      return state;
  }
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  return useContext(GameContext);
};
