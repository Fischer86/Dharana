import { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Timer from '../components/Timer';

export default function Index() {
  const router = useRouter();
  // false = Light mode par défaut, true = Dark mode
  const [isDark, setIsDark] = useState(false);

  const theme = {
    background: isDark ? '#111111' : '#f5f5f5',
    text: isDark ? '#ffffff' : '#111111',
    buttonBg: isDark ? '#2a2a2a' : '#e0e0e0',
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Dharana</Text>

        <TouchableOpacity
          style={[styles.themeButton, { backgroundColor: theme.buttonBg }]}
          onPress={() => setIsDark(!isDark)}
        >
          <Text style={{ color: theme.text, fontWeight: '500' }}>
            {isDark ? '☀️ Light' : '🌙 Dark'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* On passe la prop isDark au Timer */}
      <Timer isDark={isDark} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
  },
  themeButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
});