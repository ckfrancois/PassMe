import { Pressable, Text, View } from "react-native";

import { AuthButton } from "@/components/auth/auth-button";
import { authScreenStyles } from "@/components/auth/auth-screen-styles";
import { AuthShell } from "@/components/auth/auth-shell";
import { Image } from "react-native";
type SignedInHomeProps = {
  displayName: string;
  onGoToBle: () => void;
  onGoToExplore: () => void;
  onOpenBirthDateTest: () => void;
  onOpenUsernameTest: () => void;
  onGoToPasslingEditor: () => void;
  onSignOut: () => void;
  
};

export function SignedInHome({
  displayName,
  onGoToBle,
  onGoToExplore,
  onOpenBirthDateTest,
  onOpenUsernameTest,
  onSignOut,
  onGoToPasslingEditor,
}: SignedInHomeProps) {
  return (
    <AuthShell
     
      footer={
        <Text style={authScreenStyles.smallText}>
          Test tabs stay available below.
        </Text>
      }
      logoVisible={false}
      subtitle={`Welcome to PassMe, ${displayName}.`}
      
    >
      <Image
  source={require("@/assets/images/Passing_Example.png")}
  style={{ width: 250, height: 250 , left:45}}
  resizeMode="contain"
/>
      <View style={authScreenStyles.homeCard}>
        <Text style={authScreenStyles.homeTitle}>This is a Passling!</Text>
        <Text style={authScreenStyles.homeBody}>
          In PassMe everyone is represented by a Passling! 
          Are you ready to make your own Passling?
        </Text>
      </View>
      <AuthButton
        icon="chevron-right"
        label="Test Birth Date Page"
        onPress={onGoToPasslingEditor}
      />
    
      <Pressable onPress={onSignOut}>
        <Text style={authScreenStyles.signOutText}>Sign out</Text>
      </Pressable>
    </AuthShell>
  );
}
