import { createContext, FC, useContext, useEffect, useState } from "react";
import { BoardProps, TileProps, ValueType } from "../typings";

interface ContextProps {
  board: BoardProps;
  resetBoard: () => void;
}

const GameContext = createContext({} as ContextProps);

export const useGame = () => useContext(GameContext);

function initBoard(): BoardProps {
  function generatePlayableTiles() {
    const tileIndexes: number[] = [];
    for (let i = 0; i < 2; i++) {
      const index = Math.floor(Math.random() * 16);
      while (!tileIndexes.includes(index)) {
        tileIndexes.push(index);
      }
    }
    return tileIndexes;
  }

  const tiles: TileProps[] = [];
  const playableTiles = generatePlayableTiles();
  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 4; y++) {
      const i = x * 4 + y;

      let value: ValueType = 0;
      if (playableTiles.includes(i)) value = 2;

      tiles[i] = { position: [x, y], value };
    }
  }

  return { tiles };
}

const GameProvider: FC = ({ children }) => {
  const [board, setBoard] = useState<BoardProps>(initBoard());

  function resetBoard() {
    setBoard(initBoard());
  }

  useEffect(() => {
    resetBoard();
  }, []);

  return (
    <GameContext.Provider value={{ board, resetBoard }}>
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;
