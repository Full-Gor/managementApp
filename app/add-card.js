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
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../constants/Colors';
import { useFinance } from '../context/FinanceContext';
import { Icons } from '../components/Icons';

export default function AddCardScreen() {
  const router = useRouter();
  const { addCard } = useFinance();
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
    return formatted.substring(0, 19);
  };

  const formatExpiry = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  const getMaskedNumber = () => {
    if (cardNumber.length < 4) return '•••• •••• •••• ••••';
    const last4 = cardNumber.replace(/\s/g, '').slice(-4);
    return `•••• •••• •••• ${last4}`;
  };

  const handleAddCard = () => {
    if (!cardHolder.trim()) {
      Alert.alert('Error', 'Please enter cardholder name');
      return;
    }

    if (cardNumber.replace(/\s/g, '').length < 16) {
      Alert.alert('Error', 'Please enter a valid card number');
      return;
    }

    if (expiry.length < 5) {
      Alert.alert('Error', 'Please enter a valid expiry date');
      return;
    }

    if (cvv.length < 3) {
      Alert.alert('Error', 'Please enter a valid CVV');
      return;
    }

    addCard({
      number: getMaskedNumber(),
      holder: cardHolder,
      expires: expiry,
    });

    Alert.alert('Success', 'Card added successfully', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icons.ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Add New Card</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Card Preview */}
        <LinearGradient
          colors={[colors.primary, colors.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardPreview}
        >
          <View style={styles.cardCircle} />
          <View style={styles.cardHeader}>
            <Text style={styles.cardType}>Credit Card</Text>
            <Icons.CreditCard size={24} color={colors.text} />
          </View>
          <Text style={styles.cardLabel}>Card Number</Text>
          <Text style={styles.cardNumber}>{getMaskedNumber()}</Text>
          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.cardDetailLabel}>HOLDER</Text>
              <Text style={styles.cardDetailValue}>
                {cardHolder || 'Your Name'}
              </Text>
            </View>
            <View>
              <Text style={styles.cardDetailLabel}>EXPIRES</Text>
              <Text style={styles.cardDetailValue}>{expiry || 'MM/YY'}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Cardholder Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor={colors.textSecondary}
              value={cardHolder}
              onChangeText={setCardHolder}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Card Number</Text>
            <TextInput
              style={styles.input}
              placeholder="1234 5678 9012 3456"
              placeholderTextColor={colors.textSecondary}
              value={cardNumber}
              onChangeText={(text) => setCardNumber(formatCardNumber(text))}
              keyboardType="numeric"
              maxLength={19}
            />
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Expiry Date</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/YY"
                placeholderTextColor={colors.textSecondary}
                value={expiry}
                onChangeText={(text) => setExpiry(formatExpiry(text))}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>CVV</Text>
              <TextInput
                style={styles.input}
                placeholder="123"
                placeholderTextColor={colors.textSecondary}
                value={cvv}
                onChangeText={setCvv}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
              />
            </View>
          </View>
        </View>

        {/* Security Note */}
        <View style={styles.securityNote}>
          <Icons.Shield size={24} />
          <Text style={styles.securityText}>
            Your card information is encrypted and secure
          </Text>
        </View>

        {/* Add Button */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddCard}>
          <Text style={styles.addButtonText}>Add Card</Text>
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
  cardPreview: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    height: 200,
    position: 'relative',
    overflow: 'hidden',
  },
  cardCircle: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardType: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  cardLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  cardNumber: {
    fontSize: 20,
    letterSpacing: 2,
    color: colors.text,
    marginTop: 8,
    marginBottom: 24,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardDetailLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
  },
  cardDetailValue: {
    fontSize: 14,
    color: colors.text,
    marginTop: 4,
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
  input: {
    backgroundColor: colors.glassLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 16,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
  },
  securityText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 24,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});
