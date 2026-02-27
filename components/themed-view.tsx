import { useThemeColor } from '@/hooks/use-theme-color';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;

  gradientColors?: readonly [string, string, ...string[]];
  gradientStart?: { x: number; y: number };
  gradientEnd?: { x: number; y: number };
  gradientLocations?: readonly [number, number, ...number[]];
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  gradientColors,
  gradientStart,
  gradientEnd,
  gradientLocations,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background'
  );

  const defaultGradientColors = ['#424685', '#9c8eb7'];
  const defaultGradientStart = { x: 0.931, y: 0.473 };
  const defaultGradientEnd = { x: 0.408, y: 1.025 };

  return (
    <LinearGradient
      colors={gradientColors ?? defaultGradientColors}
      start={gradientStart ?? defaultGradientStart}
      end={gradientEnd ?? defaultGradientEnd}
      locations={gradientLocations}
      style={[styles.gradient, style]}
      {...otherProps}
    />
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});