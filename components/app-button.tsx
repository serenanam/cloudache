// components/AppButton.tsx
import { DimensionValue, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { ThemedText } from './themed-text';

type AppButtonProps = {
  title: string;
  onPress: () => void;
  width?: number | DimensionValue;
  height?: number;
  style?: ViewStyle; // extra styles if needed
};

export default function AppButton({ title, onPress, style }: AppButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
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
    paddingHorizontal: 20,
    height: 40,
    width: 180,

    //drop shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
});
