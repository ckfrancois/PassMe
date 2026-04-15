import { useState } from "react";
import { Pressable, Text } from "react-native";

import { AuthButton } from "@/components/auth/auth-button";
import { AuthField } from "@/components/auth/auth-field";
import { authScreenStyles } from "@/components/auth/auth-screen-styles";
import { AuthShell } from "@/components/auth/auth-shell";
import { TermsFooter } from "@/components/auth/terms-footer";

type UsernameScreenProps = {
  defaultValue?: string | null;
  loading: boolean;
  onBack: () => void;
  onSubmit: (username: string) => void;
};

export function UsernameScreen({
  defaultValue,
  loading,
  onBack,
  onSubmit,
}: UsernameScreenProps) {
  const [username, setUsername] = useState(defaultValue ?? "");
  const normalized = username.trim();
  const valid = /^[A-Za-z0-9-]+$/.test(normalized);

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
        disabled={loading || !normalized || !valid}
        icon="chevron-right"
        label={loading ? "Saving..." : "Next"}
        onPress={() => onSubmit(normalized)}
      />
    </AuthShell>
  );
}
