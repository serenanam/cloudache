import { useThemeColor } from '@/hooks/use-theme-color';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background'
  );

  // Default gradient settings
  const defaultGradientColors = ['#424685', '#9c8eb7'];
  const defaultGradientStart = { x: 0.931, y: 0.473 };
  const defaultGradientEnd = { x: 0.408, y: 1.025 };

  return (
    <LinearGradient
      colors={defaultGradientColors}
      start={defaultGradientStart}
      end={defaultGradientEnd}
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