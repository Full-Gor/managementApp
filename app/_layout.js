import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { FinanceProvider } from '../context/FinanceContext';
import { colors } from '../constants/Colors';

function RootLayoutNav() {
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'login';

    if (!isAuthenticated && !inAuthGroup) {
      // Rediriger vers login si pas connecte
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Rediriger vers home si deja connecte
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FinanceProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="expenses"
          options={{
            title: 'Historique Depenses',
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="income"
          options={{
            title: 'Historique Revenus',
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="transfer"
          options={{
            title: 'Transfert',
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="add-card"
          options={{
            title: 'Ajouter Carte',
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="qr-scanner"
          options={{
            title: 'Scanner QR Code',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="amount-entry"
          options={{
            title: 'Saisir Montant',
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="voice-add"
          options={{
            title: 'Ajout Vocal',
            presentation: 'modal',
            headerShown: false,
          }}
        />
      </Stack>
    </FinanceProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
