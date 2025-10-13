import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from '../store';
import { fetchUser } from '@/store/authSlice';
import { RootState } from '@/store';
import { useBiometricLock } from '@/hooks/useBiometricLock';
import BiometricLockOverlay from '@/components/BiometricLockOverlay';
import OfflineBanner from '@/components/OfflineBanner';
import { TouchableOpacity, View, Text } from 'react-native';
import { useColorScheme } from 'react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query';
import { mmkvGetString } from '@/lib/mmkv';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// React Query client is provided via '@/lib/query'

function RootLayoutContent() {
  const colorScheme = useColorScheme();
  // Remove font loading since the font file doesn't exist
  const [loaded, setLoaded] = useState(true);
  
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { isLocked, resetTimer } = useBiometricLock();
  const [showLockOverlay, setShowLockOverlay] = useState(false);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    // Check for existing token and validate session
    if (token) {
      dispatch(fetchUser(token) as any);
    }
  }, [token, dispatch]);

  useEffect(() => {
    // Restore token from MMKV on cold start
    if (!token) {
      const saved = mmkvGetString('auth_token');
      if (saved) {
        dispatch(fetchUser(saved) as any);
      }
    }
  }, [token, dispatch]);

  useEffect(() => {
    // Show lock overlay when locked
    setShowLockOverlay(isLocked);
  }, [isLocked]);

  const handleUnlock = () => {
    setShowLockOverlay(false);
  };

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <TouchableOpacity 
        activeOpacity={1} 
        style={{ flex: 1 }}
        onPressIn={resetTimer}
        onPressOut={resetTimer}
      >
        <OfflineBanner />
        <Stack>
          {/* Redirect to login screen initially */}
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <BiometricLockOverlay isVisible={showLockOverlay} onUnlock={handleUnlock} />
      </TouchableOpacity>
    </ThemeProvider>
    </QueryClientProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutContent />
    </Provider>
  );
}