import { createContext, FC, useContext, useRef, useState } from "react";
import { BoardProps, TileProps, ValueType } from "../typings";

interface ContextProps {
  board: BoardProps;
  getNextId: () => number;
  resetBoard: () => void;
  moveRight: () => void;
  moveLeft: () => void;
  moveUp: () => void;
  moveDown: () => void;
}

export const moveDuration = 150;

const GameContext = createContext({} as ContextProps);

export const useGame = () => useContext(GameContext);

const GameProvider: FC = ({ children }) => {
  const [board, setBoard] = useState<BoardProps>({ tiles: [] });
  const nextIdRef = useRef<number>(0);

  function getNextId() {
    return ++nextIdRef.current;
  }

  function addTile(tiles: TileProps[], count: number = 1): TileProps[] {
    const newTiles = [...tiles];
    const emptyPositions: [number, number][] = [];
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (
          newTiles.find(
            (tile) => tile.position[0] === x && tile.position[1] === y
          )
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

      newTiles.push({
        id: getNextId(),
        value: 2,
        position,
      });
    }

    // setBoard(newBoard);

    return newTiles;
  }

  function resetBoard() {
    const tiles = addTile([], 2);
    setBoard({ tiles });
  }

  //#region movement

  // const move = (
  //   fn: (
  //     tiles: TileProps[],
  //     moved: boolean,
  //     setMoved: (moved: boolean) => void
  //   ) => void
  // ) => {
  //   const newBoard = { ...board };
  //   const { tiles } = newBoard;

  //   let moved = false;
  //   fn(tiles, moved, (m) => (moved = m));

  //   if (!moved) return;

  //   addTile(board);
  //   setBoard(newBoard);
  // };

  // const moveUp = () =>
  //   move((tiles, moved, setMoved) => {
  //     for (let x = 0; x < 4; x++) {
  //       const filteredTiles = tiles
  //         .filter((tile) => tile.position[0] === x)
  //         .sort((a, b) => a.position[1] - b.position[1]);

  //       filteredTiles.forEach((tile) => {
  //         if (moved) return;
  //         if (tile.position[1] <= 0) return;

  //         // find if there is other tile on up
  //         moved = !filteredTiles.find(
  //           (t) => tile.position[1] - 1 === t.position[1]
  //         );
  //         setMoved(moved);
  //       });

  //       filteredTiles.map((tile) => {
  //         for (let y = 0; y <= tile.position[1]; y++) {
  //           const isTileThere = filteredTiles.find((t) => t.position[1] === y);

  //           if (isTileThere) continue;

  //           tile.position[1] = y;
  //         }
  //       });
  //     }
  //   });

  // function mergeTiles(tiles: TileProps[], tile1: TileProps, tile2: TileProps) {
  //   const i1 = tiles.findIndex((t) => t.id === tile1.id);
  //   const i2 = tiles.findIndex((t) => t.id === tile2.id);

  //   tiles.splice(i1, 1);

  //   tiles.splice(i2, 1);

  //   tiles.push({
  //     ...tile2,
  //     id: getNextId(),
  //     value: (tile2.value * 2) as ValueType,
  //   });

  //   return tiles;
  // }

  // Moves only one tile in one direction
  function move(
    tiles: TileProps[],
    tile: TileProps,
    direction: [number, number]
  ): TileProps[] | false {
    const newTiles = [...tiles];
    if (direction[1] !== 0) {
      // Move in Y axis
      const dir = direction[1];
      if (dir < 0) {
        // Move to the bottom
        // Find tiles in the same column
        const filteredTiles = newTiles.filter(
          (t) => t.position[0] === tile.position[0]
        );
        let lastFoundTile;
        for (let y = 3; y > tile.position[1]; y--) {
          const foundTile = filteredTiles.find((t) => t.position[1] === y);
          if (foundTile) lastFoundTile = foundTile;
        }
        const i = newTiles.findIndex((t) => t.id === tile.id);
        if (lastFoundTile) {
          // Tiles on the way
          if (lastFoundTile.value === tile.value) {
            // Need to merge two tiles down
            if (newTiles[i].position[1] === lastFoundTile.position[1])
              return false;
            newTiles[i].position = lastFoundTile.position;
          } else {
            // Move before last found tile
            if (newTiles[i].position[1] === lastFoundTile.position[1] - 1)
              return false;
            newTiles[i].position[1] = lastFoundTile.position[1] - 1;
          }
        } else {
          // No tiles on the way
          // Move til the border
          const i = newTiles.findIndex((t) => t.id === tile.id);
          if (newTiles[i].position[1] === 3) return false;
          newTiles[i].position[1] = 3;
        }
      } else {
        // Move to the top
        // TODO: check
      }
    } else {
      // Move in X axis
      const dir = direction[0];
      if (dir > 0) {
        // Move to the right
        // TODO: check
      } else {
        // Move to the left
        // TODO: check
      }
    }
    // tile.position = position;

    // const newBoard = { ...board, tiles };
    // setBoard(newBoard);
    return newTiles;
  }

  // function mergeTo(tiles: TileProps[], tile: TileProps, to: TileProps) {
  //   if (tile.value !== to.value) return;

  //   tile.position = to.position;

  //   // Delete tiles
  //   const i1 = tiles.findIndex((t) => t.id === tile.id);
  //   const i2 = tiles.findIndex((t) => t.id === to.id);

  //   tiles.splice(i1, 1);
  //   tiles.splice(i2, 1);

  //   // Create new one with higher value
  //   tiles.push({
  //     id: getNextId(),
  //     value: (to.value * 2) as ValueType,
  //     position: [0, 0],
  //   });
  // }

  function mergeAll(tiles: TileProps[]): TileProps[] | false {
    const newTiles = [...tiles];
    let merged = false;
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        const filteredTiles = newTiles.filter(
          (t) => t.position[0] === x && t.position[1] === y
        );

        console.log("merged", filteredTiles);
        if (filteredTiles.length < 2) continue;
        if (filteredTiles[0].value !== filteredTiles[1].value)
          throw new Error("It's not legal");

        merged = true;

        // Remove two tiles
        newTiles.splice(
          newTiles.findIndex((t) => t.id === filteredTiles[0].id),
          1
        );
        newTiles.splice(
          newTiles.findIndex((t) => t.id === filteredTiles[1].id),
          1
        );

        // Create one tile with higher value
        newTiles.push({
          ...filteredTiles[0],
          id: getNextId(),
          value: (filteredTiles[0].value * 2) as ValueType,
        });
      }
    }

    if (!merged) return false;
    return newTiles;
  }

  function checkIfLose(tiles: TileProps[]) {
    if (tiles.length < 16) return false;

    // Checking vertical lines
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 3; y++) {
        const tile = tiles.find(
          (t) => t.position[0] === x && t.position[1] === y
        );
        const nextTile = tiles.find(
          (t) => t.position[0] === x && t.position[1] === y + 1
        );

        if (tile?.value === nextTile?.value) return false;
      }
    }

    // Checking horizontal lines
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 3; x++) {
        const tile = tiles.find(
          (t) => t.position[0] === x && t.position[1] === y
        );
        const nextTile = tiles.find(
          (t) => t.position[0] === x + 1 && t.position[1] === y
        );

        if (tile?.value === nextTile?.value) return false;
      }
    }

    return true;
  }

  const moveDown = () => {
    let { tiles } = { ...board };
    let moved = false;
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        const tile = tiles.find(
          (t) => t.position[0] === x && t.position[1] === y
        );
        if (!tile) continue;

        const result = move(tiles, tile, [0, -1]);
        if (!result) continue;

        moved = true;
        tiles = result;
      }
    }
    if (!moved) return;

    const result = mergeAll(tiles);

    // Check if lose
    const lost = checkIfLose(result ? result : tiles);

    // Add new tile
    if (lost) return;

    setBoard({ ...board, tiles });

    setTimeout(() => {
      const newTiles = addTile(result ? result : tiles);
      setBoard({ ...board, tiles: newTiles });
    }, moveDuration + 30);
  };
  const moveUp = () => {};
  const moveLeft = () => {};
  const moveRight = () => {};

  // const moveDown = () =>
  //   move((tiles, moved, setMoved) => {
  //     for (let x = 3; x >= 0; x--) {
  //       // tiles in one column
  //       let filteredTiles = tiles
  //         .filter((tile) => tile.position[0] === x)
  //         .sort((a, b) => b.position[1] - a.position[1]);

  //       // check if any tile will move
  //       filteredTiles.forEach((tile) => {
  //         if (moved) return;
  //         if (tile.position[1] >= 3) return;

  //         // find if there is other tile on bottom
  //         const found = filteredTiles.find(
  //           (t) => tile.position[1] + 1 === t.position[1]
  //         );

  //         if (!found || found.value === tile.value) {
  //           moved = true;
  //           setMoved(moved);
  //           return;
  //         }
  //       });

  //       for (let y = 3; y >= 0; y--) {
  //         const tile = filteredTiles.find((t) => t.position[1] === y);
  //         if (!tile) continue;

  //         let lastTileFound: TileProps | null = null;
  //         for (let yc = 3; yc > tile.position[1]; yc--) {
  //           const nextTile = filteredTiles.find((t) => t.position[1] === yc);

  //           if (nextTile) {
  //             lastTileFound = nextTile;
  //             continue;
  //           }

  //           tile.position[1] = yc;
  //         }

  //         if (lastTileFound && tile.value === lastTileFound.value) {
  //           mergeTiles(filteredTiles, tile, lastTileFound);

  //           //setTimeout(() => {
  //           if (lastTileFound) mergeTiles(tiles, tile, lastTileFound);
  //           //}, 100);
  //         }
  //       }

  //       // moving tiles from one column
  //       // filteredTiles = filteredTiles.flatMap((tile) => {
  //       //   let lastTileFound: TileProps | null = null;
  //       //   for (let y = 3; y > tile.position[1]; y--) {
  //       //     const nextTile = filteredTiles.find((t) => t.position[1] === y);

  //       //     if (nextTile) {
  //       //       lastTileFound = nextTile;
  //       //       continue;
  //       //     }

  //       //     tile.position[1] = y;
  //       //   }

  //       //   if (lastTileFound && tile.value === lastTileFound.value) {
  //       //     mergeTiles(filteredTiles, tile, lastTileFound);

  //       //     //setTimeout(() => {
  //       //     if (lastTileFound) mergeTiles(tiles, tile, lastTileFound);
  //       //     //}, 100);
  //       //     return [];
  //       //   }

  //       //   return [tile];
  //       // });
  //     }
  //   });

  // const moveLeft = () =>
  //   move((tiles, moved, setMoved) => {
  //     for (let y = 0; y < 4; y++) {
  //       const filteredTiles = tiles
  //         .filter((tile) => tile.position[1] === y)
  //         .sort((a, b) => a.position[0] - b.position[0]);

  //       filteredTiles.forEach((tile) => {
  //         if (moved) return;
  //         if (tile.position[0] <= 0) return;

  //         // find if there is other tile on left
  //         moved = !filteredTiles.find(
  //           (t) => tile.position[0] - 1 === t.position[0]
  //         );
  //         setMoved(moved);
  //       });

  //       filteredTiles.map((tile) => {
  //         for (let x = 0; x <= tile.position[0]; x++) {
  //           const isTileThere = filteredTiles.find((t) => t.position[0] === x);

  //           if (isTileThere) continue;

  //           tile.position[0] = x;
  //         }
  //       });
  //     }
  //   });

  // const moveRight = () =>
  //   move((tiles, moved, setMoved) => {
  //     for (let y = 3; y >= 0; y--) {
  //       const filteredTiles = tiles
  //         .filter((tile) => tile.position[1] === y)
  //         .sort((a, b) => b.position[0] - a.position[0]);

  //       filteredTiles.forEach((tile) => {
  //         if (moved) return;
  //         if (tile.position[0] >= 3) return;

  //         // find if there is other tile on right
  //         moved = !filteredTiles.find(
  //           (t) => tile.position[0] + 1 === t.position[0]
  //         );
  //         setMoved(moved);
  //       });

  //       filteredTiles.map((tile) => {
  //         for (let x = 3; x >= tile.position[0]; x--) {
  //           const isTileThere = filteredTiles.find((t) => t.position[0] === x);

  //           if (isTileThere) continue;

  //           tile.position[0] = x;
  //         }
  //       });
  //     }
  //   });

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
