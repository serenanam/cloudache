import { Entypo, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

export default function BottomNavBar() {
    const router = useRouter();
    
    return (
        <View style={styles.container}>
          <Pressable style={styles.iconButton} onPress={() => router.push('/calendar')}>
            <FontAwesome5 name="calendar-alt" size={24} color="#424685" />
          </Pressable>
    
          <Pressable style={styles.middleButton} onPress={() => router.push('/record')}>
            <MaterialIcons name="bolt" size={32} color="#fff" />
          </Pressable>
    
          <Pressable style={styles.iconButton} onPress={() => router.push('/profile')}>
            <Entypo name="user" size={24} color="#424685" />
          </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 64,
        backgroundColor: '#F7F4ED',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        // borderTopLeftRadius: 16,
        // borderTopRightRadius: 16,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    iconButton: {
      padding: 12,
    },
    middleButton: {
        position: 'absolute',
        top: -32,
        left: '50%',
        transform: [{ translateX: -32 }],
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#424685',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
  });