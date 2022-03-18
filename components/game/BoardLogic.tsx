import { FC, useState } from "react";
import { View } from "react-native";
import { useGame } from "../../providers/GameProvider";

const BoardLogic: FC = ({ children }) => {
  const [prevLocation, setPrevLocation] = useState<[number, number]>();
  const [moved, setMoved] = useState(false);
  const { moveRight, moveLeft, moveDown, moveUp } = useGame();
  const threshold = 2;

  return (
    <View
      style={{ backgroundColor: "red" }}
      onStartShouldSetResponder={(e) => true}
      onMoveShouldSetResponder={(e) => true}
      onResponderStart={(e) => {
        const { locationX, locationY } = e.nativeEvent;
        setPrevLocation([locationX, locationY]);
      }}
      onResponderMove={(e) => {
        if (moved || !prevLocation) return;

        const { locationX, locationY } = e.nativeEvent;
        const xDiff = locationX - prevLocation[0];
        const yDiff = locationY - prevLocation[1];

        if (Math.abs(xDiff) > Math.abs(yDiff)) {
          if (Math.abs(xDiff) < threshold) return;
          if (xDiff > 0) {
            // right
            console.log("right");
            moveRight();
          } else {
            // left
            console.log("left");
            moveLeft();
          }
        } else {
          if (Math.abs(yDiff) < threshold) return;
          if (yDiff > 0) {
            // down
            console.log("down");
            moveDown();
          } else {
            // up
            console.log("up");
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
