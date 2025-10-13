import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput } from 'react-native';
import { useBiometricLock } from '@/hooks/useBiometricLock';

interface BiometricLockOverlayProps {
  isVisible: boolean;
  onUnlock: () => void;
}

export default function BiometricLockOverlay({ isVisible, onUnlock }: BiometricLockOverlayProps) {
  const { authenticateAndUnlock, unlockWithPin } = useBiometricLock();
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);

  const handleUnlock = async () => {
    const success = await authenticateAndUnlock();
    if (success) {
      onUnlock();
    }
  };

  const handlePinUnlock = async () => {
    setPinError(null);
    const ok = await unlockWithPin(pin.trim());
    if (ok) {
      setPin('');
      onUnlock();
    } else {
      setPinError('Invalid PIN');
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Modal transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.lockContainer}>
          <Text style={styles.lockTitle}>App Locked</Text>
          <Text style={styles.lockMessage}>Authenticate to unlock the app</Text>
          <TouchableOpacity style={styles.unlockButton} onPress={handleUnlock}>
            <Text style={styles.unlockButtonText}>Unlock</Text>
          </TouchableOpacity>
          <View style={{ height: 16 }} />
          <Text style={styles.lockMessage}>Or enter PIN</Text>
          <TextInput
            value={pin}
            onChangeText={setPin}
            placeholder="Enter PIN (0000)"
            keyboardType="number-pad"
            secureTextEntry
            maxLength={4}
            style={styles.pinInput}
          />
          {pinError ? <Text style={styles.pinError}>{pinError}</Text> : null}
          <TouchableOpacity style={styles.unlockButton} onPress={handlePinUnlock}>
            <Text style={styles.unlockButtonText}>Unlock with PIN</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  lockTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  lockMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  unlockButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  unlockButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pinInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    textAlign: 'center',
  },
  pinError: {
    color: 'red',
    marginBottom: 8,
  },
});