import { useIsFocused } from "@react-navigation/native";
import { FC, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import AppText from "../components/AppText";
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
  const { resetBoard, gameOver, score, bestScore } = useGame();

  useEffect(() => {
    if (route.params && route.params.newGame) resetBoard();
  }, [isFocused, route]);

  return (
    <Layout>
      <View style={styles.container}>
        <AppText style={styles.text}>
          Best score: <AppText fontWeight="bold">{bestScore}</AppText>
        </AppText>
        <AppText style={styles.text}>
          Score: <AppText fontWeight="bold">{score}</AppText>
        </AppText>
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
    paddingHorizontal: 32,
  },
  text: {
    alignSelf: "flex-end",
    fontSize: 24,
    marginBottom: 4,
  },
});

export default GameScreen;
