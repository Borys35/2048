import { FC } from "react";
import { StyleSheet, View } from "react-native";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import Layout from "../components/Layout";

const HomeScreen: FC = () => {
  return (
    <Layout>
      <View style={styles.container}>
        <AppText>2048</AppText>
        <View>
          <AppButton title="Continue" />
          <AppButton title="New Game" />
          <AppButton title="Settings" />
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});

export default HomeScreen;
