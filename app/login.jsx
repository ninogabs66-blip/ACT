import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { AppButton } from "../components/AppButton.jsx";
import Logo from "../components/logo.jsx";
import BackgroundWrap from "../components/backgroundWrap.jsx";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!email.trim() || !password) {
      Alert.alert("Missing Field", "Please fill in all fields.");
      return;
    }

    Alert.alert("Log in Successfully!", "Welcome back.", [
      {
        text: "OK",
        onPress: () => router.replace("/(tabs)/products"),
      },
    ]);
  };

  return (
    <BackgroundWrap>
      <View style={styles.container}>
        <View style={styles.form}>
          <Logo size={120} />

          <Text style={styles.headerTitle}>Login to Simple POS</Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email@example.com"
            placeholderTextColor="#ccc"
            onChangeText={setEmail}
            value={email}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />

          <Text style={styles.label}>Password</Text>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="#ccc"
              onChangeText={setPassword}
              value={password}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />

            <Pressable
              style={({ pressed }) => [
                styles.eyeButton,
                { opacity: pressed ? 0.5 : 1 },
              ]}
              onPress={() => setShowPassword(!showPassword)}
              hitSlop={10}
            >
              {showPassword ? (
                <EyeOff color="#64748b" size={20} />
              ) : (
                <Eye color="#64748b" size={20} />
              )}
            </Pressable>
          </View>

          <View style={styles.buttonWrapper}>
            <AppButton title="Log In" onPress={handleLogin} />
          </View>
        </View>
      </View>
    </BackgroundWrap>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  form: {
    backgroundColor: "rgba(128, 128, 128, 0.9)",
    padding: 20,
    borderRadius: 10,
    gap: 10,
    width: "100%",
    maxWidth: 320,
  },

  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 8,
  },

  label: {
    color: "white",
    fontWeight: "bold",
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "white",
    paddingHorizontal: 10,
    borderRadius: 5,
    color: "white",
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    color: "white",
  },

  eyeButton: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonWrapper: {
    marginTop: 10,
  },
});
