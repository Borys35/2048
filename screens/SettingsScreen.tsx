import Slider from "@react-native-community/slider";
import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import AppText from "../components/AppText";
import Layout from "../components/Layout";
import { useGame } from "../providers/GameProvider";

const SettingsScreen: FC = () => {
  const { hue, setHue } = useGame();

  const color = `hsl(${hue}, 100%, 30%)`;

  return (
    <Layout>
      <View style={styles.container}>
        <AppText style={[styles.label, { color }]}>
          Hue of tiles: {Math.round(hue)}
        </AppText>
        <Slider
          minimumValue={0}
          maximumValue={360}
          value={hue}
          onValueChange={setHue}
          minimumTrackTintColor={color}
          thumbTintColor={color}
          style={styles.slider}
        />
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
  label: {
    fontSize: 20,
    marginBottom: 8,
  },
  slider: {
    alignSelf: "stretch",
  },
});

export default SettingsScreen;
