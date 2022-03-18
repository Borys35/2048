import { FC } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { ValueType } from "../../typings";
import AppText from "../AppText";

interface Props extends ViewProps {
  value: ValueType;
}

const Tile: FC<Props> = ({ value, style, ...props }) => {
  return (
    <View
      style={[
        styles.tile,
        style,
        {
          backgroundColor: `hsl(20, 100%, ${100 - Math.cbrt(value) * 4}%)`,
          borderWidth: value > 0 ? 2 : 0,
        },
      ]}
      {...props}
    >
      {value > 0 && (
        <AppText fontWeight="bold" style={styles.text}>
          {value}
        </AppText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tile: {
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    paddingBottom: 4,
  },
});

export default Tile;
