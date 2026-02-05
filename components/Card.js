import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../constants/Colors';

export const Card = ({ children, style, gradient = false, gradientColors }) => {
  if (gradient) {
    return (
      <LinearGradient
        colors={gradientColors || [colors.primary, colors.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, styles.gradientCard, style]}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
  },
  gradientCard: {
    borderWidth: 0,
  },
});

export default Card;
