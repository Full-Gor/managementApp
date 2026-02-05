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
import { Svg, Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { colors } from '../constants/Colors';
import { useFinance } from '../context/FinanceContext';
import { Icons } from '../components/Icons';

export default function IncomeHistoryScreen() {
  const router = useRouter();
  const { incomeHistory, income } = useFinance();

  const totalIncome = incomeHistory.reduce((sum, item) => sum + item.amount, 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icons.ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Income History</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Total Card */}
        <LinearGradient
          colors={[colors.cardBg, `${colors.primary}15`]}
          style={styles.totalCard}
        >
          <Text style={styles.totalLabel}>Total Income</Text>
          <Text style={styles.totalAmount}>${totalIncome.toFixed(2)}</Text>

          {/* Income Chart */}
          <View style={styles.chartContainer}>
            <Svg width="100%" height="100" viewBox="0 0 200 80" preserveAspectRatio="none">
              <Defs>
                <SvgGradient id="incomeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor={colors.success} stopOpacity="0.4" />
                  <Stop offset="100%" stopColor={colors.success} stopOpacity="0" />
                </SvgGradient>
              </Defs>
              <Path
                d="M0,60 Q30,50 50,40 T100,30 T150,45 T200,20 L200,80 L0,80 Z"
                fill="url(#incomeGrad)"
              />
              <Path
                d="M0,60 Q30,50 50,40 T100,30 T150,45 T200,20"
                fill="none"
                stroke={colors.success}
                strokeWidth="2"
              />
            </Svg>
          </View>

          <View style={styles.periodSelector}>
            {['Week', 'Month', 'Year'].map((period, index) => (
              <TouchableOpacity
                key={period}
                style={[styles.periodButton, index === 1 && styles.periodButtonActive]}
              >
                <Text style={[styles.periodText, index === 1 && styles.periodTextActive]}>
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </LinearGradient>

        {/* Income Sources */}
        <View style={styles.sourcesSection}>
          <Text style={styles.sectionTitle}>Income Sources</Text>
          {[
            { name: 'Salary', percent: 78, color: colors.success },
            { name: 'Freelance', percent: 17, color: colors.primary },
            { name: 'Investment', percent: 5, color: colors.accent },
          ].map((source, index) => (
            <View key={index} style={styles.sourceItem}>
              <View style={styles.sourceInfo}>
                <View style={[styles.sourceDot, { backgroundColor: source.color }]} />
                <Text style={styles.sourceName}>{source.name}</Text>
              </View>
              <Text style={styles.sourcePercent}>{source.percent}%</Text>
            </View>
          ))}
        </View>

        {/* Income History */}
        <Text style={styles.sectionTitle}>Income History</Text>

        {incomeHistory.map((item) => (
          <TouchableOpacity key={item.id} style={styles.incomeItem}>
            <View style={styles.incomeIcon}>
              <Icons.TrendingUp size={20} />
            </View>
            <View style={styles.incomeInfo}>
              <Text style={styles.incomeName}>{item.name}</Text>
              <Text style={styles.incomeDate}>{item.date}</Text>
            </View>
            <Text style={styles.incomeAmount}>+${item.amount.toFixed(2)}</Text>
          </TouchableOpacity>
        ))}

        {/* Monthly Comparison */}
        <View style={styles.comparisonSection}>
          <Text style={styles.sectionTitle}>Monthly Comparison</Text>
          <View style={styles.comparisonCard}>
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonLabel}>This Month</Text>
              <Text style={[styles.comparisonValue, { color: colors.success }]}>
                $2,567.78
              </Text>
              <Text style={styles.comparisonChange}>+15% from last month</Text>
            </View>
            <View style={styles.comparisonDivider} />
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonLabel}>Last Month</Text>
              <Text style={styles.comparisonValue}>$2,232.85</Text>
            </View>
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
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  totalLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
    marginBottom: 16,
  },
  chartContainer: {
    height: 100,
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: colors.cardBgLight,
    borderRadius: 12,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  periodButtonActive: {
    backgroundColor: colors.primary,
  },
  periodText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  periodTextActive: {
    color: colors.text,
  },
  sourcesSection: {
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  sourceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sourceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sourceDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  sourceName: {
    fontSize: 14,
    color: colors.text,
  },
  sourcePercent: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  incomeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  incomeIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: `${colors.success}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  incomeInfo: {
    flex: 1,
    marginLeft: 12,
  },
  incomeName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  incomeDate: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  incomeAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
  },
  comparisonSection: {
    marginTop: 8,
    marginBottom: 24,
  },
  comparisonCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  comparisonItem: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  comparisonLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  comparisonValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },
  comparisonChange: {
    fontSize: 12,
    color: colors.success,
    marginTop: 4,
  },
  comparisonDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
});
