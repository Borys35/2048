import { StatusBar } from "expo-status-bar";
import { FC } from "react";
import { StyleSheet, View } from "react-native";

const Layout: FC = ({ children }) => {
  return (
    <View style={styles.layout}>
      {children}
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  layout: { flex: 1 },
});

export default Layout;
