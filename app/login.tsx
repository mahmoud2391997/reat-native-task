import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/store/authSlice';
import { RootState, AppDispatch } from '@/store';
import { router } from 'expo-router';

export default function LoginScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilyspass');

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)/categories');
    }
  }, [isAuthenticated]);

  const onSubmit = () => {
    dispatch(login({ username: username.trim(), password: password.trim() }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        autoCapitalize="none"
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
      </TouchableOpacity>

      <Text style={styles.hint}>Use demo creds: emilys / emilyspass</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { backgroundColor: '#007AFF', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
  error: { color: 'red', marginBottom: 12 },
  hint: { marginTop: 12, textAlign: 'center', color: '#666' },
});
