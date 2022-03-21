import { createContext, FC, useContext, useRef, useState } from "react";
import { BoardProps, TileProps } from "../typings";

interface ContextProps {
  board: BoardProps;
  getNextId: () => number;
  resetBoard: () => void;
  moveRight: () => void;
  moveLeft: () => void;
  moveUp: () => void;
  moveDown: () => void;
}

const GameContext = createContext({} as ContextProps);

export const useGame = () => useContext(GameContext);

const GameProvider: FC = ({ children }) => {
  const [board, setBoard] = useState<BoardProps>({ tiles: [] });
  const nextIdRef = useRef<number>(0);

  function getNextId() {
    return ++nextIdRef.current;
  }

  function addTile(b: BoardProps, count: number = 1) {
    const newBoard = { ...b };
    const { tiles } = newBoard;

    const emptyPositions: [number, number][] = [];
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (
          tiles.find((tile) => tile.position[0] === x && tile.position[1] === y)
        )
          continue;
        emptyPositions.push([x, y]);
      }
    }

    // random empty position
    for (let i = 0; i < count; i++) {
      const index = Math.floor(Math.random() * emptyPositions.length);
      const position = emptyPositions[index];

      emptyPositions.splice(index, 1);

      tiles.push({
        id: getNextId(),
        value: 2,
        position,
      });
    }

    setBoard(newBoard);
  }

  function resetBoard() {
    addTile({ tiles: [] }, 2);
  }

  //#region movement

  const move = (
    fn: (
      tiles: TileProps[],
      moved: boolean,
      setMoved: (moved: boolean) => void
    ) => void
  ) => {
    const newBoard = { ...board };
    const { tiles } = newBoard;

    let moved = false;
    fn(tiles, moved, (m) => (moved = m));

    if (!moved) return;

    addTile(board);
    setBoard(newBoard);
  };

  const moveUp = () =>
    move((tiles, moved, setMoved) => {
      for (let x = 0; x < 4; x++) {
        const filteredTiles = tiles
          .filter((tile) => tile.position[0] === x)
          .sort((a, b) => a.position[1] - b.position[1]);

        filteredTiles.forEach((tile) => {
          if (moved) return;
          if (tile.position[1] <= 0) return;

          // find if there is other tile on up
          moved = !filteredTiles.find(
            (t) => tile.position[1] - 1 === t.position[1]
          );
          setMoved(moved);
        });

        filteredTiles.map((tile) => {
          for (let y = 0; y <= tile.position[1]; y++) {
            const isTileThere = filteredTiles.find((t) => t.position[1] === y);

            if (isTileThere) continue;

            tile.position[1] = y;
          }
        });
      }
    });

  const moveDown = () =>
    move((tiles, moved, setMoved) => {
      for (let x = 3; x >= 0; x--) {
        // tiles in one column
        const filteredTiles = tiles
          .filter((tile) => tile.position[0] === x)
          .sort((a, b) => b.position[1] - a.position[1]);

        // check if any tile will move
        filteredTiles.forEach((tile) => {
          if (moved) return;
          if (tile.position[1] >= 3) return;

          // find if there is other tile on bottom
          const found = filteredTiles.find(
            (t) => tile.position[1] + 1 === t.position[1]
          );

          if (!found || found.value === tile.value) {
            moved = true;
            setMoved(moved);
            return;
          }
        });

        // moving tiles from one column
        filteredTiles.map((tile) => {
          for (let y = 3; y > tile.position[1]; y--) {
            const nextTile = filteredTiles.find((t) => t.position[1] === y);

            if (nextTile && tile.value !== nextTile.value) continue;

            tile.position[1] = y;
          }
        });
      }
    });

  const moveLeft = () =>
    move((tiles, moved, setMoved) => {
      for (let y = 0; y < 4; y++) {
        const filteredTiles = tiles
          .filter((tile) => tile.position[1] === y)
          .sort((a, b) => a.position[0] - b.position[0]);

        filteredTiles.forEach((tile) => {
          if (moved) return;
          if (tile.position[0] <= 0) return;

          // find if there is other tile on left
          moved = !filteredTiles.find(
            (t) => tile.position[0] - 1 === t.position[0]
          );
          setMoved(moved);
        });

        filteredTiles.map((tile) => {
          for (let x = 0; x <= tile.position[0]; x++) {
            const isTileThere = filteredTiles.find((t) => t.position[0] === x);

            if (isTileThere) continue;

            tile.position[0] = x;
          }
        });
      }
    });

  const moveRight = () =>
    move((tiles, moved, setMoved) => {
      for (let y = 3; y >= 0; y--) {
        const filteredTiles = tiles
          .filter((tile) => tile.position[1] === y)
          .sort((a, b) => b.position[0] - a.position[0]);

        filteredTiles.forEach((tile) => {
          if (moved) return;
          if (tile.position[0] >= 3) return;

          // find if there is other tile on right
          moved = !filteredTiles.find(
            (t) => tile.position[0] + 1 === t.position[0]
          );
          setMoved(moved);
        });

        filteredTiles.map((tile) => {
          for (let x = 3; x >= tile.position[0]; x--) {
            const isTileThere = filteredTiles.find((t) => t.position[0] === x);

            if (isTileThere) continue;

            tile.position[0] = x;
          }
        });
      }
    });

  // const moveLeft = () => {

  //   let moved = false;
  //   for (let y = 0; y < 4; y++) {
  //     const filteredTiles = tiles
  //       .filter((tile) => tile.position[1] === y)
  //       .sort((a, b) => a.position[0] - b.position[0]);

  //     filteredTiles.forEach((tile) => {
  //       if (moved) return;
  //       if (tile.position[0] <= 0) return;

  //       // find if there is other tile on left
  //       moved = !filteredTiles.find(
  //         (t) => tile.position[0] - 1 === t.position[0]
  //       );
  //     });

  //     filteredTiles.map((tile) => {
  //       for (let x = 0; x <= tile.position[0]; x++) {
  //         const isTileThere = filteredTiles.find((t) => t.position[0] === x);

  //         if (isTileThere) continue;

  //         tile.position[0] = x;
  //       }
  //     });
  //   }

  //   if (!moved) return;

  //   addTile(board);
  //   setBoard(newBoard);
  // };

  // const moveLeft = () =>
  //   move((tiles, tile, x, y) => {
  //     for (let i = 0; i < x; i++) {
  //       if (
  //         tiles.filter(tile => tile.position[1] === y).find((tile) => tile.position[0] === i && tile.position[1] === y)
  //       )
  //         continue;

  //       tile.position[0] = i;
  //       break;
  //     }
  //   });

  // const moveRight = () =>
  //   move((tiles, tile, x, y) => {
  //     for (let i = 3; i > x; i--) {
  //       if (
  //         tiles.find((tile) => tile.position[0] === i && tile.position[1] === y)
  //       )
  //         continue;

  //       tile.position[0] = i;
  //       break;
  //     }
  //   });
  //#endregion

  // useEffect(() => {
  //   initBoard();
  // }, []);

  return (
    <GameContext.Provider
      value={{
        board,
        getNextId,
        resetBoard,
        moveRight,
        moveLeft,
        moveDown,
        moveUp,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;
