import { FC } from "react";
import { StyleSheet, View } from "react-native";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import Layout from "../components/Layout";
import { useGame } from "../providers/GameProvider";

interface Props {
  navigation: any;
}

const HomeScreen: FC<Props> = ({ navigation }) => {
  const { board } = useGame();

  return (
    <Layout>
      <View style={styles.container}>
        <AppText fontWeight="bold" style={styles.logo}>
          2048
        </AppText>
        <View style={styles.buttons}>
          {!!board.tiles.length && (
            <AppButton
              title="Continue"
              onPress={() => {
                navigation.navigate("Game");
              }}
              style={styles.button}
            />
          )}
          <AppButton
            title="New Game"
            onPress={() => {
              navigation.navigate("Game", { newGame: true });
            }}
            style={styles.button}
          />
          <AppButton
            title="Settings"
            onPress={() => {
              navigation.navigate("Settings");
            }}
          />
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    fontSize: 64,
    marginBottom: 64,
  },
  buttons: {},
  button: {
    marginBottom: 16,
  },
});

export default HomeScreen;
