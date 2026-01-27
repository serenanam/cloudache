// components/ThemedView.tsx
import { useThemeColor } from '@/hooks/use-theme-color';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  gradientColors?: string[]; // optional gradient
  gradientStart?: { x: number; y: number }; // optional
  gradientEnd?: { x: number; y: number };   // optional
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  gradientColors,
  gradientStart = { x: 0, y: 0 },
  gradientEnd = { x: 1, y: 1 },
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  if (gradientColors && gradientColors.length > 0) {
    // Render LinearGradient if gradientColors are provided
    return (
      <LinearGradient
        colors={gradientColors}
        start={gradientStart}
        end={gradientEnd}
        style={[styles.gradient, style]}
        {...otherProps}
      />
    );
  }

  // fallback to normal solid background
  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
