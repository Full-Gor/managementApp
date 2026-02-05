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
import { colors } from '../constants/Colors';
import { useFinance } from '../context/FinanceContext';
import { Icons } from '../components/Icons';

export default function ExpenseHistoryScreen() {
  const router = useRouter();
  const { expenseHistory, expenses } = useFinance();

  const chartData = [40, 65, 45, 80, 55, 70, 50];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icons.ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Expense History</Text>
          <TouchableOpacity>
            <Icons.Search size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Total Card */}
        <View style={styles.totalCard}>
          <View style={styles.totalHeader}>
            <View>
              <Text style={styles.totalLabel}>Total Expenses</Text>
              <Text style={styles.totalAmount}>${expenses.toFixed(2)}</Text>
            </View>
            <View style={styles.trendBadge}>
              <Icons.TrendingUp size={16} />
              <Text style={styles.trendText}>+12%</Text>
            </View>
          </View>

          {/* Mini Chart */}
          <View style={styles.chartContainer}>
            {chartData.map((height, index) => (
              <View
                key={index}
                style={[
                  styles.chartBar,
                  {
                    height: `${height}%`,
                    opacity: index === 3 ? 1 : 0.5,
                  },
                ]}
              />
            ))}
          </View>

          <View style={styles.chartLabels}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <Text key={index} style={styles.chartLabel}>{day}</Text>
            ))}
          </View>
        </View>

        {/* Recent Section */}
        <Text style={styles.sectionTitle}>Recent</Text>

        {expenseHistory.map((item) => (
          <TouchableOpacity key={item.id} style={styles.expenseItem}>
            <View style={styles.expenseIcon}>
              <Icons.TrendingDown size={20} />
            </View>
            <View style={styles.expenseInfo}>
              <Text style={styles.expenseName}>{item.name}</Text>
              <Text style={styles.expenseDate}>{item.date}</Text>
            </View>
            <Text style={styles.expenseAmount}>
              -${Math.abs(item.amount).toFixed(2)}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Category Breakdown */}
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>By Category</Text>
          {[
            { name: 'Food & Dining', amount: 250, percent: 45, color: '#ff6b6b' },
            { name: 'Transport', amount: 120, percent: 22, color: '#ffc107' },
            { name: 'Entertainment', amount: 85, percent: 15, color: '#00d4ff' },
            { name: 'Shopping', amount: 100, percent: 18, color: '#00c853' },
          ].map((category, index) => (
            <View key={index} style={styles.categoryItem}>
              <View style={styles.categoryInfo}>
                <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                <Text style={styles.categoryName}>{category.name}</Text>
              </View>
              <View style={styles.categoryProgress}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${category.percent}%`, backgroundColor: category.color },
                    ]}
                  />
                </View>
                <Text style={styles.categoryAmount}>${category.amount}</Text>
              </View>
            </View>
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
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  totalCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  totalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  totalLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginTop: 4,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${colors.success}20`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  trendText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '500',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 80,
    gap: 8,
    marginBottom: 8,
  },
  chartBar: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    flex: 1,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  expenseIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: `${colors.danger}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expenseInfo: {
    flex: 1,
    marginLeft: 12,
  },
  expenseName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  expenseDate: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  expenseAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.danger,
  },
  categorySection: {
    marginTop: 16,
    marginBottom: 24,
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 14,
    color: colors.text,
  },
  categoryProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    width: 60,
    textAlign: 'right',
  },
});
