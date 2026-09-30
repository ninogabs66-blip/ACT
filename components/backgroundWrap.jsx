import React from "react";
import { ImageBackground, StyleSheet } from "react-native";

const BACKGROUND_URI =
  "https://raw.githubusercontent.com/Ajaaay1/Mobile-Programming---Project-MOB-ON/project-check-2-ike/assets/mobon.jpg";

export default function BackgroundWrap({ children, style }) {
  return (
    <ImageBackground
      source={{ uri: BACKGROUND_URI }}
      resizeMode="cover"
      style={[styles.background, style]}
    >
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
