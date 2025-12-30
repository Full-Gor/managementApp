import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../constants/Colors';
import { useFinance } from '../../context/FinanceContext';
import { Icons } from '../../components/Icons';

export default function WalletScreen() {
  const router = useRouter();
  const { balance, incomeHistory, expenseHistory } = useFinance();

  const totalIncome = incomeHistory.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenseHistory.reduce((sum, item) => sum + Math.abs(item.amount), 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Wallet</Text>
          <TouchableOpacity>
            <Icons.Bell size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Balance Overview */}
        <LinearGradient
          colors={[colors.cardBg, colors.cardBgLight]}
          style={styles.balanceCard}
        >
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>${balance.toLocaleString()}</Text>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/transfer')}
            >
              <LinearGradient
                colors={[colors.primary, colors.accent]}
                style={styles.actionButtonGradient}
              >
                <Icons.Send size={20} color={colors.text} />
                <Text style={styles.actionButtonText}>Send</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/qr-scanner')}
            >
              <View style={styles.actionButtonOutline}>
                <Icons.Scan size={20} color={colors.primary} />
                <Text style={[styles.actionButtonText, { color: colors.primary }]}>Receive</Text>
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => router.push('/income')}
          >
            <View style={[styles.statIcon, { backgroundColor: `${colors.success}20` }]}>
              <Icons.TrendingUp size={24} />
            </View>
            <View>
              <Text style={styles.statLabel}>Income</Text>
              <Text style={[styles.statAmount, { color: colors.success }]}>
                +${totalIncome.toLocaleString()}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statCard}
            onPress={() => router.push('/expenses')}
          >
            <View style={[styles.statIcon, { backgroundColor: `${colors.danger}20` }]}>
              <Icons.TrendingDown size={24} />
            </View>
            <View>
              <Text style={styles.statLabel}>Expenses</Text>
              <Text style={[styles.statAmount, { color: colors.danger }]}>
                -${totalExpenses.toFixed(2)}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
        </View>

        {[...incomeHistory.slice(0, 2), ...expenseHistory.slice(0, 2)]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((item, index) => (
            <View key={index} style={styles.activityItem}>
              <View style={[
                styles.activityIcon,
                { backgroundColor: item.amount > 0 ? `${colors.success}20` : `${colors.danger}20` }
              ]}>
                {item.amount > 0 ? (
                  <Icons.TrendingUp size={20} />
                ) : (
                  <Icons.TrendingDown size={20} />
                )}
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityName}>{item.name}</Text>
                <Text style={styles.activityDate}>{item.date}</Text>
              </View>
              <Text style={[
                styles.activityAmount,
                { color: item.amount > 0 ? colors.success : colors.danger }
              ]}>
                {item.amount > 0 ? '+' : '-'}${Math.abs(item.amount).toFixed(2)}
              </Text>
            </View>
          ))}
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
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  balanceCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.text,
    marginVertical: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  actionButtonOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityInfo: {
    flex: 1,
    marginLeft: 12,
  },
  activityName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  activityDate: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
});
