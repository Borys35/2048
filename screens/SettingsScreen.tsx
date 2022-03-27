import Slider from "@react-native-community/slider";
import RadioButtons from "radio-buttons-react-native";
import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import AppText from "../components/AppText";
import Layout from "../components/Layout";
import { tileSets, useGame } from "../providers/GameProvider";
import { TileSetProps } from "../typings";

const SettingsScreen: FC = () => {
  const { hue, setHue, tileSetId, setTileSetId } = useGame();

  const color = `hsl(${hue}, 100%, 30%)`;

  return (
    <Layout>
      <View style={styles.container}>
        <AppText style={[styles.label]}>Tile sets</AppText>
        <RadioButtons
          data={tileSets}
          initial={tileSetId}
          selectedBtn={(tileSet: TileSetProps) => {
            setTileSetId(tileSet.id);
          }}
          style={styles.input}
        />
        <View style={styles.spacer} />
        <AppText style={[styles.label, { color }]}>
          Tile hue: {Math.round(hue)}
        </AppText>
        <Slider
          minimumValue={0}
          maximumValue={360}
          value={hue}
          onValueChange={setHue}
          minimumTrackTintColor={color}
          thumbTintColor={color}
          style={styles.input}
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
  input: {
    alignSelf: "stretch",
  },
  spacer: {
    height: 64,
  },
});

export default SettingsScreen;
