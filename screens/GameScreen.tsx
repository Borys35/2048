import { useIsFocused } from "@react-navigation/native";
import { FC, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Board from "../components/game/Board";
import BoardLogic from "../components/game/BoardLogic";
import GameOver from "../components/GameOver";
import Layout from "../components/Layout";
import { useGame } from "../providers/GameProvider";

interface Props {
  navigation: any;
  route: any;
}

const GameScreen: FC<Props> = ({ route, navigation }) => {
  const isFocused = useIsFocused();
  const { resetBoard, gameOver } = useGame();

  useEffect(() => {
    if (route.params && route.params.newGame) resetBoard();
  }, [isFocused, route]);

  return (
    <Layout>
      <View style={styles.container}>
        <BoardLogic>
          <Board />
        </BoardLogic>
      </View>

      {gameOver && <GameOver navigation={navigation} />}
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default GameScreen;
