import { useState } from "react";
import { Pressable, Text } from "react-native";

import { AuthButton } from "@/components/auth/auth-button";
import { AuthField } from "@/components/auth/auth-field";
import { authScreenStyles } from "@/components/auth/auth-screen-styles";
import { AuthShell } from "@/components/auth/auth-shell";
import { TermsFooter } from "@/components/auth/terms-footer";

type BirthDateScreenProps = {
  defaultValue?: string | null;
  loading: boolean;
  onBack: () => void;
  onSubmit: (birthDate: string) => void;
};

export function BirthDateScreen({
  defaultValue,
  loading,
  onBack,
  onSubmit,
}: BirthDateScreenProps) {
  const [birthDate, setBirthDate] = useState(defaultValue ?? "");

  return (
    <AuthShell footer={<TermsFooter />} logoVisible={false}>
      <Pressable onPress={onBack} style={authScreenStyles.backButton}>
        <Text style={authScreenStyles.backButtonText}>‹</Text>
      </Pressable>
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
        disabled={loading || !birthDate.trim()}
        icon="chevron-right"
        label={loading ? "Saving..." : "Next"}
        onPress={() => onSubmit(birthDate.trim())}
      />
    </AuthShell>
  );
}
