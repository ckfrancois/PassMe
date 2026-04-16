import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useState } from "react";
import { Alert, Pressable, Text } from "react-native";

import { AuthButton } from "@/components/auth/auth-button";
import { AuthField } from "@/components/auth/auth-field";
import { authScreenStyles } from "@/components/auth/auth-screen-styles";
import { AuthShell } from "@/components/auth/auth-shell";
import { TermsFooter } from "@/components/auth/terms-footer";

type BirthDateScreenProps = {
  defaultValue?: string | null;
  loading: boolean;
  onBack: () => void;
  onSubmit?: (birthDate: string) => void; // optional now
};

export function BirthDateScreen({
  defaultValue,
  loading,
  onBack,
  onSubmit,
}: BirthDateScreenProps) {
  const [birthDate, setBirthDate] = useState(defaultValue ?? "");
  const [saving, setSaving] = useState(false);

  const normalized = birthDate.trim();

  const handleSave = async () => {
    if (!normalized) return;

    setSaving(true);
    try {
      const user = auth().currentUser;
      if (!user) throw new Error("No user found");

      // 🔹 Creates field if it doesn't exist (merge: true)
      await firestore().collection("Users").doc(user.uid).set(
        {
          birthDate: normalized,
        },
        { merge: true }
      );

      // optional navigation callback
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
      <Text style={authScreenStyles.question}>When were you born?</Text>

      <AuthField
        autoCapitalize="words"
        autoCorrect={false}
        onChangeText={setBirthDate}
        placeholder="May 18, 2004"
        returnKeyType="done"
        value={birthDate}
      />

      <AuthButton
        disabled={loading || saving || !normalized}
        icon="chevron-right"
        label={saving ? "Saving..." : "Next"}
        onPress={handleSave}
      />
    </AuthShell>
  );
}