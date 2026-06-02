import { UserProfileData } from "@/services/profile-service";
import { useTheme } from "@/theme/use-theme";
import { Image, View } from "react-native";
import { StyledText } from "./styled-text";

interface ProfileCardProps {
  profile: UserProfileData;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
      }}
    >
      <Image
        source={{ uri: profile.avatarUrl }}
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: colors.surfaceRaised,
          borderWidth: 2,
          borderColor: colors.accent + "40",
        }}
        accessibilityLabel={`${profile.firstName}'s avatar`}
      />
      <View style={{ flex: 1, gap: 3 }}>
        <StyledText variant="section" style={{ color: colors.primary }}>
          {profile.firstName} {profile.lastName}
        </StyledText>
        <StyledText variant="caption" style={{ color: colors.secondary }}>
          @{profile.username}
        </StyledText>
        <StyledText variant="caption" style={{ color: colors.disabled }}>
          {profile.email}
        </StyledText>
      </View>
    </View>
  );
}
