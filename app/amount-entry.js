import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../constants/Colors';
import { Icons } from '../components/Icons';

export default function AmountEntryScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState('0');

  const handleKeyPress = (key) => {
    if (key === '⌫') {
      setAmount((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
    } else if (key === '.') {
      if (!amount.includes('.')) {
        setAmount((prev) => prev + '.');
      }
    } else {
      if (amount === '0') {
        setAmount(key);
      } else {
        setAmount((prev) => prev + key);
      }
    }
  };

  const formatAmount = () => {
    const num = parseFloat(amount) || 0;
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  const handleContinue = () => {
    router.push({
      pathname: '/transfer',
      params: { amount: amount },
    });
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icons.ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Enter Amount</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Amount Display */}
      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>Amount to send</Text>
        <Text style={styles.amountDisplay}>${formatAmount()}</Text>
      </View>

      {/* Numeric Keyboard */}
      <View style={styles.keyboard}>
        {keys.map((key) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.keyButton,
              key === '⌫' && styles.keyButtonSpecial,
            ]}
            onPress={() => handleKeyPress(key)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.keyText,
                key === '⌫' && styles.keyTextSpecial,
              ]}
            >
              {key}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            parseFloat(amount) === 0 && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={parseFloat(amount) === 0}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  amountContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  amountDisplay: {
    fontSize: 56,
    fontWeight: '700',
    color: colors.text,
  },
  keyboard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  keyButton: {
    width: '30%',
    aspectRatio: 1.5,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyButtonSpecial: {
    backgroundColor: `${colors.primary}20`,
  },
  keyText: {
    fontSize: 28,
    fontWeight: '500',
    color: colors.text,
  },
  keyTextSpecial: {
    fontSize: 24,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  continueButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
});
