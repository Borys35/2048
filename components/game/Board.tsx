import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useGame } from "../../providers/GameProvider";
import { TileProps } from "../../typings";
import Tile from "./Tile";

interface Props {}

const Board: FC<Props> = () => {
  const {
    board: { tiles },
    hue,
  } = useGame();

  const distSize = 64;

  function generateEmptyTiles() {
    const tiles: TileProps[] = [];
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        tiles.push({ id: -1, position: [x, y], value: 0 });
      }
    }

    return tiles.map(({ position, value }, i) => (
      <Tile
        key={i}
        value={value}
        top={position[1] * distSize}
        left={position[0] * distSize}
      />
    ));
  }

  return (
    <View
      style={[
        styles.board,
        {
          width: 4 * distSize + 4,
          height: 4 * distSize + 4,
          transform: [{ scale: 1.1 }],
          backgroundColor: `hsl(${hue}, 90%, 90%)`,
        },
      ]}
    >
      {generateEmptyTiles()}
      {tiles.map(({ position, value, id }) => (
        <Tile
          key={id}
          value={value}
          top={position[1] * distSize}
          left={position[0] * distSize}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 2,
  },
});

export default Board;
