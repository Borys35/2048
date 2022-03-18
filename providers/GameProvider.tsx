import { createContext, FC, useContext, useEffect, useState } from "react";
import { BoardProps, TileProps, ValueType } from "../typings";

interface ContextProps {
  board: BoardProps;
  resetBoard: () => void;
  moveRight: () => void;
  moveLeft: () => void;
  moveUp: () => void;
  moveDown: () => void;
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
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      const i = y * 4 + x;

      let value: ValueType = 0;
      if (playableTiles.includes(i)) value = 2;
      else continue;

      // tiles[i] = { position: [x, y], value };
      tiles.push({ position: [x, y], value });
    }
  }

  return { tiles };
}

const GameProvider: FC = ({ children }) => {
  const [board, setBoard] = useState<BoardProps>(initBoard());

  function resetBoard() {
    setBoard(initBoard());
  }

  function move(
    fn: (tiles: TileProps[], tile: TileProps, x: number, y: number) => void
  ) {
    const newBoard = { ...board };
    const { tiles } = newBoard;

    tiles.map((tile) => {
      const x = tile.position[0];
      const y = tile.position[1];

      fn(tiles, tile, x, y);
    });

    setBoard(newBoard);
  }

  const moveUp = () =>
    move((tiles, tile, x, y) => {
      for (let i = 0; i < y; i++) {
        if (
          tiles.find((tile) => tile.position[1] === i && tile.position[0] === x)
        )
          continue;

        tile.position[1] = i;
        break;
      }
    });

  const moveDown = () =>
    move((tiles, tile, x, y) => {
      for (let i = 3; i > y; i--) {
        if (
          tiles.find((tile) => tile.position[1] === i && tile.position[0] === x)
        )
          continue;

        tile.position[1] = i;
        break;
      }
    });

  const moveLeft = () =>
    move((tiles, tile, x, y) => {
      for (let i = 0; i < x; i++) {
        if (
          tiles.find((tile) => tile.position[0] === i && tile.position[1] === y)
        )
          continue;

        tile.position[0] = i;
        break;
      }
    });

  const moveRight = () =>
    move((tiles, tile, x, y) => {
      for (let i = 3; i > x; i--) {
        if (
          tiles.find((tile) => tile.position[0] === i && tile.position[1] === y)
        )
          continue;

        tile.position[0] = i;
        break;
      }
    });

  useEffect(() => {
    resetBoard();
  }, []);

  return (
    <GameContext.Provider
      value={{ board, resetBoard, moveRight, moveLeft, moveDown, moveUp }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;
