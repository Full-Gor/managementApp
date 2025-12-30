import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../constants/Colors';
import { useFinance } from '../../context/FinanceContext';
import { Icons } from '../../components/Icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

export default function CardsScreen() {
  const router = useRouter();
  const { cards, balance } = useFinance();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Cards</Text>
          <TouchableOpacity onPress={() => router.push('/add-card')}>
            <Icons.Plus size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Cards List */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          style={styles.cardsContainer}
          contentContainerStyle={styles.cardsContent}
        >
          {cards.map((card, index) => (
            <LinearGradient
              key={card.id}
              colors={index === 0 ? [colors.primary, colors.accent] : [colors.cardBgLight, colors.cardBg]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardItem}
            >
              <View style={styles.cardCircle} />
              <View style={styles.cardHeader}>
                <Text style={styles.cardType}>Debit Card</Text>
                <Icons.CreditCard size={24} color={colors.text} />
              </View>
              <Text style={styles.cardNumber}>{card.number}</Text>
              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.cardLabel}>HOLDER</Text>
                  <Text style={styles.cardValue}>{card.holder}</Text>
                </View>
                <View>
                  <Text style={styles.cardLabel}>EXPIRES</Text>
                  <Text style={styles.cardValue}>{card.expires}</Text>
                </View>
              </View>
            </LinearGradient>
          ))}

          {/* Add Card Button */}
          <TouchableOpacity
            style={styles.addCardButton}
            onPress={() => router.push('/add-card')}
          >
            <View style={styles.addCardIcon}>
              <Icons.Plus size={32} color={colors.primary} />
            </View>
            <Text style={styles.addCardText}>Add New Card</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Card Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionItem}>
              <View style={[styles.actionIcon, { backgroundColor: `${colors.primary}20` }]}>
                <Icons.Lock size={24} color={colors.primary} />
              </View>
              <Text style={styles.actionLabel}>Lock Card</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem}>
              <View style={[styles.actionIcon, { backgroundColor: `${colors.accent}20` }]}>
                <Icons.Settings size={24} color={colors.accent} />
              </View>
              <Text style={styles.actionLabel}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem}>
              <View style={[styles.actionIcon, { backgroundColor: `${colors.success}20` }]}>
                <Icons.Shield size={24} />
              </View>
              <Text style={styles.actionLabel}>Security</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem}>
              <View style={[styles.actionIcon, { backgroundColor: `${colors.warning}20` }]}>
                <Icons.Bell size={24} color={colors.warning} />
              </View>
              <Text style={styles.actionLabel}>Alerts</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Card Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Card Statistics</Text>
          <View style={styles.statCard}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Monthly Limit</Text>
              <Text style={styles.statValue}>$10,000</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '25%' }]} />
            </View>
            <Text style={styles.statSubtext}>$2,500 of $10,000 used</Text>
          </View>
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
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  cardsContainer: {
    marginBottom: 24,
  },
  cardsContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  cardItem: {
    width: CARD_WIDTH,
    height: 200,
    borderRadius: 24,
    padding: 24,
    marginRight: 16,
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
  },
  cardType: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  cardNumber: {
    fontSize: 20,
    letterSpacing: 2,
    color: colors.text,
    marginTop: 32,
    marginBottom: 32,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
  },
  cardValue: {
    fontSize: 14,
    color: colors.text,
    marginTop: 4,
  },
  addCardButton: {
    width: CARD_WIDTH,
    height: 200,
    borderRadius: 24,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCardIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  addCardText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionItem: {
    width: '48%',
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 14,
    color: colors.text,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  statSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
