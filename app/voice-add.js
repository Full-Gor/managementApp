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
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

export default function VoiceAddScreen() {
  const router = useRouter();
  const { addTransaction } = useFinance();

  // Hook de reconnaissance vocale
  const {
    isListening,
    transcript,
    interimTranscript,
    error: speechError,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({ language: 'fr-FR' });

  const [inputText, setInputText] = useState('');
  const [parsedResult, setParsedResult] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [editedAmount, setEditedAmount] = useState('');
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Mettre à jour inputText avec le transcript de la reconnaissance vocale
  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  // Animation du micro quand on écoute
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
    const textToAnalyze = inputText || transcript;
    if (textToAnalyze && textToAnalyze.length > 2) {
      const result = parseVoiceInput(textToAnalyze);
      setParsedResult(result);
      if (result && result.amount) {
        setEditedAmount(result.amount.toString());
      }
      setSuggestions(getSuggestions(textToAnalyze));
    } else {
      setParsedResult(null);
      setSuggestions([]);
    }
  }, [inputText, transcript]);

  // Afficher les erreurs de reconnaissance vocale
  useEffect(() => {
    if (speechError) {
      Alert.alert('Erreur', speechError);
    }
  }, [speechError]);

  const handleMicPress = async () => {
    if (isListening) {
      stopListening();
    } else {
      // Réinitialiser avant de commencer
      resetTranscript();
      setInputText('');

      if (!isSupported) {
        Alert.alert(
          'Non supporté',
          Platform.OS === 'web'
            ? 'Utilisez Chrome ou Edge pour la reconnaissance vocale.\n\nVous pouvez aussi taper directement votre texte ci-dessous.'
            : 'La reconnaissance vocale n\'est pas disponible sur cet appareil.\n\nVous pouvez taper directement votre texte ci-dessous.',
          [{ text: 'OK' }]
        );
        return;
      }

      const started = await startListening();
      if (!started && !speechError) {
        Alert.alert(
          'Conseil',
          'Parlez clairement après le bip.\n\nExemples:\n• "Restaurant 25 euros"\n• "Essence 50€ hier"\n• "Salaire reçu 2000"',
          [{ text: 'OK' }]
        );
      }
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

  // Texte affiché pendant l'écoute
  const getDisplayText = () => {
    if (interimTranscript) {
      return inputText + interimTranscript;
    }
    return inputText;
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

        {/* Status Badge */}
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: isSupported ? `${colors.success}20` : `${colors.warning}20` }
          ]}>
            <View style={[
              styles.statusDot,
              { backgroundColor: isSupported ? colors.success : colors.warning }
            ]} />
            <Text style={[
              styles.statusText,
              { color: isSupported ? colors.success : colors.warning }
            ]}>
              {isSupported ? 'Micro disponible' : 'Saisie manuelle'}
            </Text>
          </View>
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
                colors={isListening ? ['#ff4757', '#ff6b81'] : [colors.primary, colors.accent]}
                style={styles.micGradient}
              >
                <View style={styles.micIcon}>
                  <Icons.Mic size={48} color={colors.text} />
                </View>
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>
          <Text style={styles.micText}>
            {isListening ? '🔴 Écoute en cours... Appuyez pour arrêter' : '🎤 Appuyez pour parler'}
          </Text>

          {/* Interim transcript display */}
          {isListening && interimTranscript && (
            <View style={styles.interimContainer}>
              <Text style={styles.interimText}>"{interimTranscript}"</Text>
            </View>
          )}
        </View>

        {/* Text Input */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>
            {isSupported ? 'Ou tapez directement :' : 'Tapez votre transaction :'}
          </Text>
          <TextInput
            style={[styles.textInput, isListening && styles.textInputListening]}
            placeholder='Ex: "Restaurant 25 euros hier"'
            placeholderTextColor={colors.textSecondary}
            value={getDisplayText()}
            onChangeText={setInputText}
            multiline
            autoCapitalize="none"
            editable={!isListening}
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
              <Text style={styles.originalTextLabel}>Texte analysé :</Text>
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
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  micContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  micButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  micButtonActive: {
    shadowColor: '#ff4757',
    shadowOpacity: 0.8,
    shadowRadius: 40,
  },
  micGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micIcon: {
    opacity: 0.95,
  },
  micText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  interimContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: `${colors.accent}20`,
    borderRadius: 12,
    maxWidth: '90%',
  },
  interimText: {
    fontSize: 16,
    color: colors.accent,
    fontStyle: 'italic',
    textAlign: 'center',
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
  textInputListening: {
    borderColor: colors.accent,
    borderWidth: 2,
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
