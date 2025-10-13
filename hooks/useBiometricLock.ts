import { useState, useEffect, useCallback } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { AppState } from 'react-native';

export const useBiometricLock = () => {
  const [isLocked, setIsLocked] = useState(false);
  const [biometryAvailable, setBiometryAvailable] = useState(false);
  const [lastActiveTime, setLastActiveTime] = useState(Date.now());

  // Check if biometric hardware is available
  useEffect(() => {
    const checkBiometry = async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const supported = await LocalAuthentication.isEnrolledAsync();
      setBiometryAvailable(hasHardware && supported);
    };

    checkBiometry();
  }, []);

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'background') {
        // Lock immediately when going to background
        setIsLocked(true);
      } else if (nextAppState === 'active') {
        // Reset active time when coming back to foreground
        setLastActiveTime(Date.now());
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);

  // Handle inactivity timeout
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      // Auto-lock after 10 seconds of inactivity
      if (now - lastActiveTime > 10000 && !isLocked) {
        setIsLocked(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastActiveTime, isLocked]);

  const authenticateAndUnlock = useCallback(async () => {
    if (!biometryAvailable) {
      setIsLocked(false);
      return true;
    }

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock MyApp',
        fallbackLabel: 'Enter Password',
        disableDeviceFallback: false,
      });

      if (result.success) {
        setIsLocked(false);
        setLastActiveTime(Date.now());
        return true;
      }
      return false;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  }, [biometryAvailable]);

  const unlockWithPin = useCallback(async (pin: string) => {
    // Simple fixed PIN check per requirement
    if (pin === '0000') {
      setIsLocked(false);
      setLastActiveTime(Date.now());
      return true;
    }
    return false;
  }, []);

  const resetTimer = useCallback(() => {
    setLastActiveTime(Date.now());
  }, []);

  return {
    isLocked,
    biometryAvailable,
    authenticateAndUnlock,
    unlockWithPin,
    resetTimer,
  };
};