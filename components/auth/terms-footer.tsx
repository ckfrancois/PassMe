import { Link } from "expo-router";
import { Text } from "react-native";

import { authScreenStyles } from "@/components/auth/auth-screen-styles";

export function TermsFooter() {
  return (
    <Text style={authScreenStyles.termsText}>
      By registering with PassMe you are agreeing to our{" "}
      <Link href="/modal" style={authScreenStyles.termsLink}>
        Terms of Service
      </Link>
    </Text>
  );
}
