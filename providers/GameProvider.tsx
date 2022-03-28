import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  FC,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { BoardProps, TileProps, TileSetProps, ValueType } from "../typings";

interface ContextProps {
  board: BoardProps;
  gameOver: boolean;
  score: number;
  bestScore: number;
  hue: number;
  tileSetId: number;
  setHue: (arg: number) => void;
  setTileSetId: (arg: number) => void;
  getNextId: () => number;
  resetBoard: () => void;
  moveRight: () => void;
  moveLeft: () => void;
  moveUp: () => void;
  moveDown: () => void;
}

export const moveDuration = 120;
export const tileSets: TileSetProps[] = [
  { id: 1, label: "Default", chars: [] },
  {
    id: 2,
    label: "Fruits 🍏",
    chars: [
      "🍏",
      "🍐",
      "🍈",
      "🍎",
      "🍓",
      "🍒",
      "🍊",
      "🍉",
      "🍑",
      "🍍",
      "🍌",
      "🍋",
    ],
  },
  {
    id: 3,
    label: "Animals 🐀",
    chars: [
      "🐀",
      "🐌",
      "🐇",
      "🐍",
      "🐓",
      "🐎",
      "🐕",
      "🐟",
      "🐢",
      "🐋",
      "🐖",
      "🐉",
    ],
  },
];

const GameContext = createContext({} as ContextProps);

export const useGame = () => useContext(GameContext);

const GameProvider: FC = ({ children }) => {
  const [board, setBoard] = useState<BoardProps>({ tiles: [] });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [hue, setHue] = useState(20);
  const [tileSetId, setTileSetId] = useState(1);
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

      // 5% for 4 tile
      const value: ValueType = Math.random() < 0.05 ? 4 : 2;

      newTiles.push({
        id: getNextId(),
        value,
        position,
      });
    }

    return newTiles;
  }

  function resetBoard() {
    setGameOver(false);
    setScore(0);
    const tiles = addTile([], 2);
    setBoard({
      tiles,
    });
  }

  //#region movement

  function moveInDirection(
    inColumns: boolean,
    downOrRight: boolean,
    tiles: TileProps[],
    tile: TileProps
  ) {
    const newTiles = [...tiles];

    const offset = downOrRight ? -1 : 1;
    const endPos = downOrRight ? 3 : 0;
    const posIndex = inColumns ? 1 : 0;

    // Move to the bottom
    // Find tiles in the same column
    let filteredTiles = [];
    // const filteredTiles = newTiles.filter(
    //   (t) => t.position[0] === tile.position[0]
    // );
    if (inColumns) {
      filteredTiles = newTiles.filter(
        (t) => t.position[0] === tile.position[0]
      );
    } else {
      filteredTiles = newTiles.filter(
        (t) => t.position[1] === tile.position[1]
      );
    }
    let lastFoundTiles;
    if (downOrRight)
      for (let c = 3; c > tile.position[posIndex]; c--) {
        // const foundTile = filteredTiles.find((t) => t.position[posIndex] === c);
        const foundTiles = filteredTiles.filter(
          (t) => t.position[posIndex] === c
        );
        if (foundTiles.length) lastFoundTiles = foundTiles;
      }
    else
      for (let c = 0; c < tile.position[posIndex]; c++) {
        const foundTiles = filteredTiles.filter(
          (t) => t.position[posIndex] === c
        );
        if (foundTiles.length) lastFoundTiles = foundTiles;
      }
    const i = newTiles.findIndex((t) => t.id === tile.id);
    if (lastFoundTiles) {
      // Only one found tile
      const lastFoundTile = lastFoundTiles[0];
      if (lastFoundTiles.length < 2 && lastFoundTile.value === tile.value) {
        // Need to merge two tiles down
        if (newTiles[i].position[posIndex] === lastFoundTile.position[posIndex])
          return false;
        newTiles[i].position = lastFoundTile.position;
      } else {
        // Move before last found tile
        if (
          newTiles[i].position[posIndex] ===
          lastFoundTile.position[posIndex] + offset
        )
          return false;
        newTiles[i].position[posIndex] =
          lastFoundTile.position[posIndex] + offset;
      }
    } else {
      // No tiles on the way
      // Move til the border
      if (newTiles[i].position[posIndex] === endPos) return false;
      newTiles[i].position[posIndex] = endPos;
    }

    return true;
  }

  // Moves only one tile in one direction
  function move(
    tiles: TileProps[],
    tile: TileProps,
    direction: [number, number]
  ): TileProps[] | false {
    const newTiles = [...tiles];
    const m = (inColumns: boolean, downOrRight: boolean) =>
      moveInDirection(inColumns, downOrRight, newTiles, tile);

    if (direction[1] !== 0) {
      // Move in Y axis
      const dir = direction[1];
      if (dir < 0) {
        // Move to the bottom
        if (!m(true, true)) return false;
      } else {
        // Move to the top
        if (!m(true, false)) return false;
      }
    } else {
      // Move in X axis
      const dir = direction[0];
      if (dir > 0) {
        // Move to the right
        if (!m(false, true)) return false;
      } else {
        // Move to the left
        if (!m(false, false)) return false;
      }
    }

    return newTiles;
  }

  function mergeAll(tiles: TileProps[]): TileProps[] | false {
    const newTiles = [...tiles];
    let merged = false;
    let scoreToAdd = 0;
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        const filteredTiles = newTiles.filter(
          (t) => t.position[0] === x && t.position[1] === y
        );

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
        const newValue = (filteredTiles[0].value * 2) as ValueType;
        scoreToAdd += newValue;
        newTiles.push({
          ...filteredTiles[0],
          id: getNextId(),
          value: newValue,
        });
      }
    }

    if (!merged) return false;

    const newScore = score + scoreToAdd;
    setScore(newScore);
    if (newScore > bestScore) {
      setBestScore(newScore);
      AsyncStorage.setItem("best-score", newScore.toString());
    }
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

  function moveAll(direction: [number, number]) {
    let { tiles } = { ...board };
    let moved = false;

    if (direction[0] !== 0) {
      if (direction[0] > 0) {
        // Move to right
        for (let y = 0; y < 4; y++) {
          for (let x = 3; x >= 0; x--) {
            const tile = tiles.find(
              (t) => t.position[0] === x && t.position[1] === y
            );
            if (!tile) continue;

            const result = move(tiles, tile, direction);
            if (!result) continue;

            moved = true;
            tiles = result;
          }
        }
      } else {
        // Move to left
        for (let y = 0; y < 4; y++) {
          for (let x = 0; x < 4; x++) {
            const tile = tiles.find(
              (t) => t.position[0] === x && t.position[1] === y
            );
            if (!tile) continue;

            const result = move(tiles, tile, direction);
            if (!result) continue;

            moved = true;
            tiles = result;
          }
        }
      }
    } else {
      if (direction[1] > 0) {
        // Move to top
        for (let x = 0; x < 4; x++) {
          for (let y = 0; y < 4; y++) {
            const tile = tiles.find(
              (t) => t.position[0] === x && t.position[1] === y
            );
            if (!tile) continue;

            const result = move(tiles, tile, direction);
            if (!result) continue;

            moved = true;
            tiles = result;
          }
        }
      } else {
        // Move to bottom
        for (let x = 0; x < 4; x++) {
          for (let y = 3; y >= 0; y--) {
            const tile = tiles.find(
              (t) => t.position[0] === x && t.position[1] === y
            );
            if (!tile) continue;

            const result = move(tiles, tile, direction);
            if (!result) continue;

            moved = true;
            tiles = result;
          }
        }
      }
    }

    if (!moved) return;

    const result = mergeAll(tiles);

    const newBoard = { ...board, tiles };
    setBoard(newBoard);
    AsyncStorage.setItem("state", JSON.stringify({ board: newBoard, score }));

    setTimeout(() => {
      // Add new tile
      const newTiles = addTile(result ? result : tiles);

      // Check if lose
      if (checkIfLose(newTiles)) {
        setGameOver(true);
      }

      const newBoard = { ...board, tiles: newTiles };
      setBoard(newBoard);
    }, moveDuration + 30);
  }

  const moveDown = () => {
    moveAll([0, -1]);
  };
  const moveUp = () => {
    moveAll([0, 1]);
  };
  const moveLeft = () => {
    moveAll([-1, 0]);
  };
  const moveRight = () => {
    moveAll([1, 0]);
  };

  //#endregion

  useEffect(() => {
    (async () => {
      const bs = await AsyncStorage.getItem("best-score");
      if (bs) {
        setBestScore(parseInt(bs));
      }

      const stateJson = await AsyncStorage.getItem("state");
      if (stateJson) {
        const { board, score } = JSON.parse(stateJson);
        setBoard(board);
        setScore(score);
      }
    })();
  }, []);

  return (
    <GameContext.Provider
      value={{
        board,
        gameOver,
        score,
        bestScore,
        hue,
        tileSetId,
        setHue,
        setTileSetId,
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
