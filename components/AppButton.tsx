import { FC } from "react";
import { Pressable, StyleSheet } from "react-native";
import AppText from "./AppText";

interface Props {
  title: string;
}

const AppButton: FC<Props> = ({ title }) => {
  return (
    <Pressable style={styles.button}>
      <AppText>{title}</AppText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {},
});

export default AppButton;
