import { useThemeColor } from '@/hooks/use-theme-color';
import { StyleSheet, Text, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'header';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor ?? '#ffffff', dark: darkColor }, 'text');

  // Select fontFamily based on type
  const fontFamily =
    type === 'title' ? 'Raleway-Bold' : 'Raleway-SemiBold';

  return (
    <Text
      style={[
        { color, fontFamily },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type == 'header' ? styles.header : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontSize: 56,
    lineHeight: 60,
  },
  subtitle: {
    fontSize: 32,
    lineHeight: 40,
  },
  header: {
    fontSize: 24,
    lineHeight: 30,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    color: '#0a7ea4',
    textDecorationLine: 'underline',
  },
});