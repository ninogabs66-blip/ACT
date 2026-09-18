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
import { colors, radius, spacing } from "../constants/theme";

const REGISTERED_USERS = [
  { email: "admin@possystem.com", password: "admin123" },
  { email: "cashier@possystem.com", password: "cashier123" },
];

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!email.trim() || !password) {
      Alert.alert("Missing Field", "Please fill in all fields.");
      return;
    }

    const isRegistered = REGISTERED_USERS.some(
      (user) =>
        user.email.toLowerCase() === email.trim().toLowerCase() &&
        user.password === password
    );

    if (!isRegistered) {
      Alert.alert(
        "Login Failed",
        "Email or password is incorrect, or this account is not registered."
      );
      return;
    }

    router.replace("/(tabs)/products");
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>P</Text>
        </View>

        <Text style={styles.headerTitle}>Login to Simple POS</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="email@example.com"
          placeholderTextColor={colors.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
          value={email}
        />

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor={colors.textMuted}
            onChangeText={setPassword}
            value={password}
            secureTextEntry={!showPassword}
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
              <Eye color={colors.textSecondary} size={20} />
            ) : (
              <EyeOff color={colors.textSecondary} size={20} />
            )}
          </Pressable>
        </View>

        <View style={styles.buttonWrapper}>
          <AppButton title="Log In" onPress={handleLogin} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  form: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    borderRadius: radius.lg,
    gap: spacing.sm,
    width: "100%",
    maxWidth: 320,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: spacing.sm,
  },
  logoText: {
    color: colors.white,
    fontSize: 32,
    fontWeight: "800",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  label: {
    color: colors.text,
    fontWeight: "600",
    fontSize: 14,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    color: colors.text,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: spacing.md,
    color: colors.text,
    fontSize: 16,
  },
  eyeButton: {
    padding: spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonWrapper: {
    marginTop: spacing.sm,
  },
});