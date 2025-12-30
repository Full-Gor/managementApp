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

export default function DashboardScreen() {
  const router = useRouter();
  const { balance, income, expenses, transactions, user } = useFinance();

  const quickActions = [
    { icon: Icons.Send, label: 'Send', route: '/transfer', color: colors.primary },
    { icon: Icons.Mic, label: 'Voice', route: '/voice-add', color: colors.warning },
    { icon: Icons.Scan, label: 'Scan', route: '/qr-scanner', color: colors.accent },
    { icon: Icons.Plus, label: 'Add', route: '/add-card', color: colors.success },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back</Text>
            <Text style={styles.userName}>{user.name}</Text>
          </View>
          <TouchableOpacity style={styles.avatar}>
            <View style={styles.avatarPlaceholder} />
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <LinearGradient
          colors={[colors.primary, colors.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>${balance.toLocaleString()}</Text>
          <View style={styles.balanceStats}>
            <View>
              <Text style={styles.statLabel}>Income</Text>
              <Text style={styles.statValue}>${income.toLocaleString()}</Text>
            </View>
            <View>
              <Text style={styles.statLabel}>Expenses</Text>
              <Text style={styles.statValue}>${expenses.toLocaleString()}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickActionButton}
              onPress={() => router.push(action.route)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}20` }]}>
                <action.icon size={24} color={action.color} />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Transactions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Transactions</Text>
          <TouchableOpacity onPress={() => router.push('/expenses')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {transactions.map((item) => (
          <TouchableOpacity key={item.id} style={styles.transactionItem}>
            <View style={[styles.transactionIcon, { backgroundColor: `${item.color}20` }]}>
              <Text style={styles.transactionEmoji}>
                {item.icon === 'cart' ? '🛒' : item.icon === 'arrow-up-right' ? '↗️' : '📺'}
              </Text>
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionName}>{item.name}</Text>
              <Text style={styles.transactionDate}>{item.date}</Text>
            </View>
            <Text
              style={[
                styles.transactionAmount,
                { color: item.amount > 0 ? colors.success : colors.danger },
              ]}
            >
              {item.amount > 0 ? '+' : ''}${Math.abs(item.amount)}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Finance Overview */}
        <View style={styles.overviewSection}>
          <TouchableOpacity
            style={styles.overviewCard}
            onPress={() => router.push('/expenses')}
          >
            <View style={styles.overviewHeader}>
              <Text style={styles.overviewTitle}>Expenses</Text>
              <Icons.TrendingDown size={20} />
            </View>
            <Text style={styles.overviewAmount}>-${expenses.toLocaleString()}</Text>
            <Text style={styles.overviewSubtext}>This month</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.overviewCard}
            onPress={() => router.push('/income')}
          >
            <View style={styles.overviewHeader}>
              <Text style={styles.overviewTitle}>Income</Text>
              <Icons.TrendingUp size={20} />
            </View>
            <Text style={[styles.overviewAmount, { color: colors.success }]}>
              +${income.toLocaleString()}
            </Text>
            <Text style={styles.overviewSubtext}>This month</Text>
          </TouchableOpacity>
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
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 4,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 22,
  },
  balanceCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.text,
    marginVertical: 8,
  },
  balanceStats: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 2,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  quickActionButton: {
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  seeAll: {
    fontSize: 12,
    color: colors.primary,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionEmoji: {
    fontSize: 20,
  },
  transactionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  transactionName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  transactionDate: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  overviewSection: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginBottom: 24,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  overviewTitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  overviewAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.danger,
  },
  overviewSubtext: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
