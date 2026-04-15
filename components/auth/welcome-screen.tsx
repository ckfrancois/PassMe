import { AuthButton } from "@/components/auth/auth-button";
import { AuthShell } from "@/components/auth/auth-shell";

type WelcomeScreenProps = {
  loading: boolean;
  onGooglePress: () => void;
};

export function WelcomeScreen({ loading, onGooglePress }: WelcomeScreenProps) {
  return (
    <AuthShell
      footer={<></>}
      showWordmark
      subtitle={"Cross paths.\nCollect connections."}
    >
      <AuthButton
        disabled={loading}
        icon="google"
        label={loading ? "Signing in..." : "Sign in with Google"}
        onPress={onGooglePress}
      />
      <AuthButton
        disabled
        icon="apple"
        label="Sign in with Apple"
        onPress={() => undefined}
        variant="secondary"
      />
    </AuthShell>
  );
}
