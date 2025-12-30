import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FinanceProvider } from '../context/FinanceContext';
import { colors } from '../constants/Colors';

export default function RootLayout() {
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
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="expenses"
          options={{
            title: 'Expense History',
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="income"
          options={{
            title: 'Income History',
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="transfer"
          options={{
            title: 'Transfer',
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="add-card"
          options={{
            title: 'Add New Card',
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="qr-scanner"
          options={{
            title: 'Scan QR Code',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="amount-entry"
          options={{
            title: 'Enter Amount',
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="voice-add"
          options={{
            title: 'Voice Add',
            presentation: 'modal',
            headerShown: false,
          }}
        />
      </Stack>
    </FinanceProvider>
  );
}
