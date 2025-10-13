import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/authSlice';
import { router } from 'expo-router';

export default function LogoutScreen() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logout());
    // Small delay to ensure state updates before navigation
    const t = setTimeout(() => {
      router.replace('/login');
    }, 50);
    return () => clearTimeout(t);
  }, [dispatch]);

  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 12 }}>Signing you out...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
