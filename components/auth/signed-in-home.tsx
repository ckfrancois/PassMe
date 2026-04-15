import { Pressable, Text, View } from "react-native";

import { AuthButton } from "@/components/auth/auth-button";
import { authScreenStyles } from "@/components/auth/auth-screen-styles";
import { AuthShell } from "@/components/auth/auth-shell";

type SignedInHomeProps = {
  displayName: string;
  onGoToBle: () => void;
  onGoToExplore: () => void;
  onSignOut: () => void;
};

export function SignedInHome({
  displayName,
  onGoToBle,
  onGoToExplore,
  onSignOut,
}: SignedInHomeProps) {
  return (
    <AuthShell
      footer={
        <Text style={authScreenStyles.smallText}>
          Test tabs stay available below.
        </Text>
      }
      subtitle={`Welcome back, ${displayName}.`}
    >
      <View style={authScreenStyles.homeCard}>
        <Text style={authScreenStyles.homeTitle}>Ready to test?</Text>
        <Text style={authScreenStyles.homeBody}>
          Your auth state now lives in context, so BLE and the rest of the app
          can read the same user session.
        </Text>
      </View>
      <AuthButton
        icon="chevron-right"
        label="Open BLE Test Tab"
        onPress={onGoToBle}
      />
      <AuthButton
        icon="chevron-right"
        label="Open Explore Tab"
        onPress={onGoToExplore}
        variant="secondary"
      />
      <Pressable onPress={onSignOut}>
        <Text style={authScreenStyles.signOutText}>Sign out</Text>
      </Pressable>
    </AuthShell>
  );
}
