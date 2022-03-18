import { FC } from "react";
import { Text, TextProps } from "react-native";

interface Props extends TextProps {
  fontWeight?: "regular" | "bold";
}

const AppText: FC<Props> = ({
  children,
  fontWeight = "regular",
  style,
  ...props
}) => {
  const fontFamily =
    fontWeight === "regular"
      ? "Oswald_400Regular"
      : (fontWeight === "bold" && "Oswald_700Bold") || "";

  return (
    <Text style={[style, { fontFamily }]} {...props}>
      {children}
    </Text>
  );
};

export default AppText;
