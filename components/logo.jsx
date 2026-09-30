import React from "react";
import { Image, StyleSheet } from "react-native";

const LOGO_URI =
  "https://raw.githubusercontent.com/Ajaaay1/Mobile-Programming---Project-MOB-ON/project-check-2-ike/assets/logo.jpg";

export default function Logo({ size = 120, style }) {
  return (
    <Image
      source={{ uri: LOGO_URI }}
      style={[
        styles.logo,
        {
          width: size,
          height: size,
        },
        style,
      ]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    alignSelf: "center",
  },
});
