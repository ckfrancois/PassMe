import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useState } from "react";
import { Alert, Pressable, Text } from "react-native";

import { AuthButton } from "@/components/auth/auth-button";
import { AuthField } from "@/components/auth/auth-field";
import { authScreenStyles } from "@/components/auth/auth-screen-styles";
import { AuthShell } from "@/components/auth/auth-shell";
import { TermsFooter } from "@/components/auth/terms-footer";

type UsernameScreenProps = {
  defaultValue?: string | null;
  loading: boolean;
  onBack: () => void;
  onSubmit?: (username: string) => void; // optional now
};

export function UsernameScreen({
  defaultValue,
  loading,
  onBack,
  onSubmit,
}: UsernameScreenProps) {
  const [username, setUsername] = useState(defaultValue ?? "");
  const [saving, setSaving] = useState(false);

  const normalized = username.trim();
  const valid = /^[A-Za-z0-9-]+$/.test(normalized);

  const handleSave = async () => {
    if (!normalized || !valid) return;

    setSaving(true);
    try {
      const user = auth().currentUser;
      if (!user) throw new Error("No user found");

      // 🔹 Same as profile page
      await user.updateProfile({ displayName: normalized });

      await firestore().collection("Users").doc(user.uid).set(
        {
          displayName: normalized,
        },
        { merge: true }
      );

      // optional callback (keeps your flow intact)
      onSubmit?.(normalized);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthShell
      footer={<TermsFooter />}
      logoVisible={false}
      topRightOverlay={
        <Pressable onPress={onBack} style={authScreenStyles.backButton}>
          <Text style={authScreenStyles.backButtonText}>‹</Text>
        </Pressable>
      }
    >
      <Text style={authScreenStyles.question}>What is your username?</Text>

      <AuthField
        autoCapitalize="none"
        autoCorrect={false}
        helperText={
          "Only use:\n• Letters (A-Z, a-z)\n• Numbers (0-9)\n• dashes (-)"
        }
        onChangeText={setUsername}
        placeholder="TestUser123"
        value={username}
      />

      <AuthButton
        disabled={loading || saving || !normalized || !valid}
        icon="chevron-right"
        label={saving ? "Saving..." : "Next"}
        onPress={handleSave}
      />
    </AuthShell>
  );
}