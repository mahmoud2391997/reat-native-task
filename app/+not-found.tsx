import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function NotFound() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Not Found</Text>
      <Text style={styles.text}>The page you are looking for does not exist.</Text>
      <Link href="/" style={styles.link}>Go to Home</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  text: { color: '#555', marginBottom: 16, textAlign: 'center' },
  link: { color: '#007AFF', fontWeight: '600' },
});
