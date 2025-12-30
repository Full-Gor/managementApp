import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../constants/Colors';
import { useFinance } from '../context/FinanceContext';
import { Icons } from '../components/Icons';

export default function TransferScreen() {
  const router = useRouter();
  const { balance, recipients, transfer } = useFinance();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const handleTransfer = () => {
    if (!recipient.trim()) {
      Alert.alert('Error', 'Please enter a recipient');
      return;
    }

    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const result = transfer(recipient, transferAmount, note);

    if (result.success) {
      Alert.alert('Success', result.message, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const selectRecipient = (name) => {
    setRecipient(name);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icons.ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Transfer</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>${balance.toLocaleString()}</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Recipient</Text>
            <View style={styles.inputWrapper}>
              <Icons.User size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Enter recipient name or ID"
                placeholderTextColor={colors.textSecondary}
                value={recipient}
                onChangeText={setRecipient}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Amount</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                placeholderTextColor={colors.textSecondary}
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Note (optional)</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Add a note"
                placeholderTextColor={colors.textSecondary}
                value={note}
                onChangeText={setNote}
              />
            </View>
          </View>
        </View>

        {/* Recent Recipients */}
        <View style={styles.recipientsSection}>
          <Text style={styles.sectionTitle}>Recent Recipients</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recipientsList}
          >
            {recipients.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.recipientItem,
                  recipient === item.name && styles.recipientItemActive,
                ]}
                onPress={() => selectRecipient(item.name)}
              >
                <View style={styles.recipientAvatar}>
                  <Text style={styles.recipientInitial}>{item.name[0]}</Text>
                </View>
                <Text style={styles.recipientName}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quick Amounts */}
        <View style={styles.quickAmounts}>
          <Text style={styles.sectionTitle}>Quick Amount</Text>
          <View style={styles.amountsGrid}>
            {[50, 100, 200, 500].map((value) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.quickAmountButton,
                  amount === value.toString() && styles.quickAmountButtonActive,
                ]}
                onPress={() => setAmount(value.toString())}
              >
                <Text
                  style={[
                    styles.quickAmountText,
                    amount === value.toString() && styles.quickAmountTextActive,
                  ]}
                >
                  ${value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Transfer Button */}
        <TouchableOpacity style={styles.transferButton} onPress={handleTransfer}>
          <Text style={styles.transferButtonText}>Transfer Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  balanceCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  balanceLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glassLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  recipientsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  recipientsList: {
    gap: 16,
  },
  recipientItem: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
  },
  recipientItemActive: {
    backgroundColor: `${colors.primary}20`,
  },
  recipientAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  recipientInitial: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  recipientName: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  quickAmounts: {
    marginBottom: 32,
  },
  amountsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAmountButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  quickAmountButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  quickAmountTextActive: {
    color: colors.text,
  },
  transferButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 24,
  },
  transferButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});
