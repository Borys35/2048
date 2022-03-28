import { FC } from "react";
import { Pressable, PressableProps, StyleSheet } from "react-native";
import AppText from "./AppText";

interface Props extends PressableProps {
  title: string;
}

const AppButton: FC<Props> = ({ title, style, ...props }) => {
  return (
    <Pressable style={[styles.button, style as any]} {...props}>
      <AppText fontWeight="regular" style={styles.text}>
        {title}
      </AppText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    elevation: 4,
    borderRadius: 8,
    borderWidth: 2,
  },
  text: {
    fontSize: 20,
  },
});

export default AppButton;
