import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { colors } from '../constants/Colors';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login, register, error, loading } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async () => {
    setLocalError('');

    if (!email || !password) {
      setLocalError('Email et mot de passe requis');
      return;
    }

    if (!isLogin && !name) {
      setLocalError('Nom requis pour l\'inscription');
      return;
    }

    let result;
    if (isLogin) {
      result = await login(email, password);
    } else {
      result = await register(email, password, name);
    }

    if (result.success) {
      router.replace('/(tabs)');
    } else {
      setLocalError(result.error || 'Erreur');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        {/* Header */}
        <LinearGradient
          colors={[colors.primary, colors.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.logo}>FinanceApp</Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Connectez-vous' : 'Creez votre compte'}
          </Text>
        </LinearGradient>

        {/* Form */}
        <View style={styles.form}>
          {!isLogin && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nom</Text>
              <TextInput
                style={styles.input}
                placeholder="Votre nom"
                placeholderTextColor={colors.textSecondary}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="votre@email.com"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {(localError || error) && (
            <Text style={styles.error}>{localError || error}</Text>
          )}

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            <LinearGradient
              colors={[colors.primary, colors.accent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.submitGradient}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>
                  {isLogin ? 'Se connecter' : 'S\'inscrire'}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => {
              setIsLogin(!isLogin);
              setLocalError('');
            }}
          >
            <Text style={styles.switchText}>
              {isLogin
                ? 'Pas de compte ? Inscrivez-vous'
                : 'Deja un compte ? Connectez-vous'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  header: {
    paddingVertical: 60,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  logo: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  form: {
    flex: 1,
    padding: 24,
    paddingTop: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
  },
  error: {
    color: colors.danger,
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  switchText: {
    color: colors.primary,
    fontSize: 14,
  },
});
