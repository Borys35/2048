import { FC, useEffect, useRef } from "react";
import { Animated, StyleSheet, ViewProps } from "react-native";
import { moveDuration } from "../../providers/GameProvider";
import { ValueType } from "../../typings";
import AppText from "../AppText";

interface Props extends ViewProps {
  value: ValueType;
  top: number;
  left: number;
}

const Tile: FC<Props> = ({ value, top, left, style, ...props }) => {
  const posAnim = useRef(new Animated.ValueXY({ x: left, y: top })).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  function divindingTimes(val: number) {
    let times = 0;
    while (val > 2) {
      val /= 2;
      times++;
    }
    return times;
  }

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: moveDuration,
      useNativeDriver: false,
    }).start();
  }, []);

  useEffect(() => {
    Animated.timing(posAnim, {
      toValue: { x: left, y: top },
      duration: moveDuration,
      useNativeDriver: false,
    }).start();
  }, [top, left]);

  return (
    <Animated.View
      style={[
        styles.tile,
        style,
        {
          backgroundColor: `hsl(20, 100%, ${100 - divindingTimes(value) * 4}%)`,
          borderWidth: value > 0 ? 2 : 0,
          position: "absolute",
          top: posAnim.y,
          left: posAnim.x,
          transform: [{ scale: scaleAnim }],
        },
      ]}
      {...props}
    >
      {value > 0 && (
        <AppText
          fontWeight="bold"
          style={[
            styles.text,
            { color: divindingTimes(value) >= 8 ? "#fff" : "#000" },
          ]}
        >
          {value}
        </AppText>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tile: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
  },
  text: {
    fontSize: 24,
    paddingBottom: 4,
  },
});

export default Tile;
