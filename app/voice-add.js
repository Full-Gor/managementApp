import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  Animated,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../constants/Colors';
import { useFinance } from '../context/FinanceContext';
import { Icons } from '../components/Icons';
import { parseVoiceInput, getSuggestions } from '../utils/voiceParser';

export default function VoiceAddScreen() {
  const router = useRouter();
  const { addTransaction } = useFinance();
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState('');
  const [parsedResult, setParsedResult] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [editedAmount, setEditedAmount] = useState('');
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Animation du micro quand on "écoute"
  useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isListening]);

  // Analyser le texte quand il change
  useEffect(() => {
    if (inputText.length > 2) {
      const result = parseVoiceInput(inputText);
      setParsedResult(result);
      if (result && result.amount) {
        setEditedAmount(result.amount.toString());
      }
      setSuggestions(getSuggestions(inputText));
    } else {
      setParsedResult(null);
      setSuggestions([]);
    }
  }, [inputText]);

  const handleMicPress = () => {
    if (isListening) {
      setIsListening(false);
      // Simuler fin d'écoute
    } else {
      setIsListening(true);
      // Sur le web, on pourrait utiliser Web Speech API
      // Sur mobile, on utiliserait @react-native-voice/voice
      // Pour l'instant, on simule avec un placeholder

      // Afficher un message informatif
      Alert.alert(
        'Reconnaissance vocale',
        'Tapez votre texte ci-dessous.\n\nExemples:\n• "Restaurant 25 euros"\n• "Essence 50€ hier"\n• "Salaire reçu 2000"',
        [{ text: 'OK', onPress: () => setIsListening(false) }]
      );
    }
  };

  const handleSuggestionPress = (suggestion) => {
    setInputText(suggestion.text + ' ');
  };

  const handleConfirm = () => {
    if (!parsedResult) {
      Alert.alert('Erreur', 'Aucune transaction détectée');
      return;
    }

    const amount = parseFloat(editedAmount) || parsedResult.amount;
    if (!amount || amount <= 0) {
      Alert.alert('Erreur', 'Veuillez entrer un montant valide');
      return;
    }

    // Créer la transaction
    addTransaction({
      name: parsedResult.name,
      amount: parsedResult.isIncome ? amount : -amount,
      icon: parsedResult.category,
      color: parsedResult.color,
    });

    Alert.alert(
      'Transaction ajoutée',
      `${parsedResult.icon} ${parsedResult.name}: ${parsedResult.isIncome ? '+' : '-'}$${amount}`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const formatDate = (date) => {
    if (!date) return '';
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return date.toLocaleDateString('fr-FR', options);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icons.ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Ajouter par la voix</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Microphone Button */}
        <View style={styles.micContainer}>
          <TouchableOpacity onPress={handleMicPress} activeOpacity={0.8}>
            <Animated.View
              style={[
                styles.micButton,
                isListening && styles.micButtonActive,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <LinearGradient
                colors={isListening ? [colors.accent, colors.primary] : [colors.primary, colors.accent]}
                style={styles.micGradient}
              >
                <View style={styles.micIcon}>
                  <Icons.Phone size={40} color={colors.text} />
                </View>
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>
          <Text style={styles.micText}>
            {isListening ? 'Écoute en cours...' : 'Appuyez pour parler'}
          </Text>
        </View>

        {/* Text Input (fallback) */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Ou tapez directement :</Text>
          <TextInput
            style={styles.textInput}
            placeholder='Ex: "Restaurant 25 euros hier"'
            placeholderTextColor={colors.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            autoCapitalize="none"
          />
        </View>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsLabel}>Suggestions :</Text>
            <View style={styles.suggestionsList}>
              {suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionChip}
                  onPress={() => handleSuggestionPress(suggestion)}
                >
                  <Text style={styles.suggestionIcon}>{suggestion.icon}</Text>
                  <Text style={styles.suggestionText}>{suggestion.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Parsed Result Preview */}
        {parsedResult && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>Transaction détectée</Text>
              <View style={[styles.confidenceBadge, {
                backgroundColor: parsedResult.confidence >= 80
                  ? `${colors.success}20`
                  : parsedResult.confidence >= 50
                    ? `${colors.warning}20`
                    : `${colors.danger}20`
              }]}>
                <Text style={[styles.confidenceText, {
                  color: parsedResult.confidence >= 80
                    ? colors.success
                    : parsedResult.confidence >= 50
                      ? colors.warning
                      : colors.danger
                }]}>
                  {parsedResult.confidence}%
                </Text>
              </View>
            </View>

            {/* Category */}
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Catégorie</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryIcon}>{parsedResult.icon}</Text>
                <Text style={styles.categoryName}>{parsedResult.name}</Text>
              </View>
            </View>

            {/* Amount */}
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Montant</Text>
              <View style={styles.amountInputWrapper}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.amountInput}
                  value={editedAmount}
                  onChangeText={setEditedAmount}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>

            {/* Type */}
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Type</Text>
              <View style={[styles.typeBadge, {
                backgroundColor: parsedResult.isIncome ? `${colors.success}20` : `${colors.danger}20`
              }]}>
                <Text style={[styles.typeText, {
                  color: parsedResult.isIncome ? colors.success : colors.danger
                }]}>
                  {parsedResult.isIncome ? '↓ Revenu' : '↑ Dépense'}
                </Text>
              </View>
            </View>

            {/* Date */}
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Date</Text>
              <Text style={styles.resultValue}>{formatDate(parsedResult.date)}</Text>
            </View>

            {/* Original Text */}
            <View style={styles.originalTextContainer}>
              <Text style={styles.originalTextLabel}>Texte original :</Text>
              <Text style={styles.originalText}>"{parsedResult.originalText}"</Text>
            </View>
          </View>
        )}

        {/* Confirm Button */}
        {parsedResult && (
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>Confirmer la transaction</Text>
          </TouchableOpacity>
        )}

        {/* Examples Section */}
        <View style={styles.examplesSection}>
          <Text style={styles.examplesTitle}>Exemples de phrases :</Text>
          {[
            'Restaurant 30 euros',
            'Courses carrefour 85€ hier',
            'Essence 50 dollars',
            'Salaire reçu 2500',
            'Netflix 15 euros',
            'Uber taxi 25€',
            'Pharmacie 12 euros demain',
          ].map((example, index) => (
            <TouchableOpacity
              key={index}
              style={styles.exampleItem}
              onPress={() => setInputText(example)}
            >
              <Text style={styles.exampleText}>"{example}"</Text>
            </TouchableOpacity>
          ))}
        </View>
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
    marginBottom: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  micContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  micButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  micButtonActive: {
    shadowOpacity: 0.8,
    shadowRadius: 30,
  },
  micGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micIcon: {
    opacity: 0.9,
  },
  micText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  suggestionsContainer: {
    marginBottom: 24,
  },
  suggestionsLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  suggestionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.primary}20`,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  suggestionIcon: {
    fontSize: 14,
  },
  suggestionText: {
    fontSize: 12,
    color: colors.primary,
  },
  resultCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  confidenceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '600',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  resultValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryIcon: {
    fontSize: 20,
  },
  categoryName: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  amountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glassLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  amountInput: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    minWidth: 60,
    textAlign: 'right',
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  originalTextContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: colors.glassLight,
    borderRadius: 12,
  },
  originalTextLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  originalText: {
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 32,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  examplesSection: {
    marginBottom: 32,
  },
  examplesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  exampleItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  exampleText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
