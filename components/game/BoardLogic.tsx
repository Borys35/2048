import { FC, useState } from "react";
import { View } from "react-native";
import { useGame } from "../../providers/GameProvider";

const BoardLogic: FC = ({ children }) => {
  const [prevLocation, setPrevLocation] = useState<[number, number]>();
  const [moved, setMoved] = useState(false);
  const { moveRight, moveLeft, moveDown, moveUp } = useGame();
  const threshold = 20;

  return (
    <View
      onStartShouldSetResponder={(e) => true}
      onMoveShouldSetResponder={(e) => true}
      onResponderStart={(e) => {
        const { pageX, pageY } = e.nativeEvent.touches[0];
        setPrevLocation([pageX, pageY]);
      }}
      onResponderMove={(e) => {
        if (moved || !prevLocation) return;

        const { pageX, pageY } = e.nativeEvent.touches[0];
        const xDiff = pageX - prevLocation[0];
        const yDiff = pageY - prevLocation[1];

        // console.log("x", xDiff, "y", yDiff);

        if (Math.abs(xDiff) > Math.abs(yDiff)) {
          if (Math.abs(xDiff) < threshold) return;
          if (xDiff > 0) {
            // right
            moveRight();
          } else {
            // left
            moveLeft();
          }
        } else {
          if (Math.abs(yDiff) < threshold) return;
          if (yDiff > 0) {
            // down
            moveDown();
          } else {
            // up
            moveUp();
          }
        }

        setMoved(true);
      }}
      onResponderEnd={(e) => {
        setPrevLocation(undefined);
        setMoved(false);
      }}
    >
      {children}
    </View>
  );
};

export default BoardLogic;
