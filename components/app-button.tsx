// components/AppButton.tsx
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { ThemedText } from './themed-text';

type AppButtonProps = {
  title: string;
  onPress: () => void;
  width?: number | string;
  height?: number;
  style?: ViewStyle; // extra styles if needed
};

export default function AppButton({ title, onPress, width = '80%', height = 50, style }: AppButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, { width, height }, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <ThemedText type="defaultSemiBold" style={styles.text}>
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0a7ea4',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
});
