import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useGame } from "../../providers/GameProvider";
import Tile from "./Tile";

interface Props {}

const Board: FC<Props> = () => {
  const {
    board: { tiles },
  } = useGame();

  const distSize = 64;

  return (
    <View style={[styles.board, { width: 4 * distSize, height: 4 * distSize }]}>
      {tiles.map(({ position, value }, i) => (
        <Tile
          key={i}
          value={value}
          style={{
            position: "absolute",
            top: position[1] * distSize,
            left: position[0] * distSize,
          }}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {},
});

export default Board;
