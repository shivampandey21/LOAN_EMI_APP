// EmiScheduleScreen.jsx
import React, { useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import API_ENDPOINTS from '../services/apiEndpoints';
// import API_ENDPOINTS from '../api/endpoints';

const EmiScheduleScreen = ({ route }) => {
  const { token } = useContext(AuthContext);
  const { loanId } = route.params || {};
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);

  const fetchEmiSchedule = async () => {
    if (!loanId) {
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching EMI schedule for loan:', loanId);

      // Fetch EMI schedule
      const scheduleResponse = await fetch(
        API_ENDPOINTS.BASE_URL + API_ENDPOINTS.EMI_SCHEDULE(loanId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      // Fetch loan summary
      const summaryResponse = await fetch(
        API_ENDPOINTS.BASE_URL + API_ENDPOINTS.LOAN_SUMMARY(loanId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (scheduleResponse.ok) {
        const scheduleData = await scheduleResponse.json();
        console.log('EMI schedule data:', scheduleData);
        setSchedule(scheduleData.emis || []);
      } else {
        console.error('Failed to fetch EMI schedule:', scheduleResponse.status);
      }

      if (summaryResponse.ok) {
        const summaryData = await summaryResponse.json();
        console.log('Summary data:', summaryData);
        setSummary(summaryData);
      } else {
        console.error('Failed to fetch summary:', summaryResponse.status);
      }
    } catch (error) {
      console.error('Error fetching EMI schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log('EmiScheduleScreen focused, fetching data');
      setLoading(true);
      fetchEmiSchedule();

      return () => {
        console.log('EmiScheduleScreen unfocused');
      };
    }, [loanId, token]),
  );

  // Rest of the component remains the same...

  const renderEmiItem = ({ item, index }) => (
    <View
      style={[
        styles.emiCard,
        item.status === 'paid' && styles.paidCard,
        item.status === 'overdue' && styles.overdueCard,
      ]}
    >
      <View style={styles.emiHeader}>
        <Text style={styles.emiNumber}>EMI #{index + 1}</Text>
        <View
          style={[
            styles.emiStatus,
            item.status === 'paid'
              ? styles.paidStatus
              : item.status === 'overdue'
              ? styles.overdueStatus
              : styles.pendingStatus,
          ]}
        >
          <Text style={styles.emiStatusText}>
            {item.status ? item.status.toUpperCase() : 'PENDING'}
          </Text>
        </View>
      </View>

      <Text style={styles.dueDate}>
        Due Date: {new Date(item.due_date).toLocaleDateString()}
      </Text>

      <View style={styles.emiDetails}>
        <View style={styles.emiDetail}>
          <Text style={styles.emiLabel}>Principal</Text>
          <Text style={styles.emiValue}>
            ₹{item.principal_component || '0'}
          </Text>
        </View>
        <View style={styles.emiDetail}>
          <Text style={styles.emiLabel}>Interest</Text>
          <Text style={styles.emiValue}>₹{item.interest_component || '0'}</Text>
        </View>
        <View style={styles.emiDetail}>
          <Text style={styles.emiLabel}>Total EMI</Text>
          <Text style={[styles.emiValue, styles.totalEmi]}>
            ₹{item.emi_amount || '0'}
          </Text>
        </View>
      </View>

      {item.payment_date && (
        <Text style={styles.paymentDate}>
          Paid on: {new Date(item.payment_date).toLocaleDateString()}
        </Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading EMI schedule...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>EMI Schedule</Text>
        <Text style={styles.headerSubtitle}>Loan #{loanId || 'N/A'}</Text>
      </View>

      {summary && (
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total EMI</Text>
              <Text style={styles.summaryValue}>{schedule.length}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Paid</Text>
              <Text style={styles.summaryValue}>
                {schedule.filter(e => e.status === 'paid').length}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Pending</Text>
              <Text style={styles.summaryValue}>
                {schedule.filter(e => e.status !== 'paid').length}
              </Text>
            </View>
          </View>

          <View style={styles.summaryDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total Payable:</Text>
              <Text style={styles.detailValue}>
                ₹{summary.total_payable || '0'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount Paid:</Text>
              <Text style={styles.detailValue}>
                ₹{summary.amount_paid || '0'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Remaining:</Text>
              <Text style={styles.detailValue}>
                ₹{summary.remaining_amount || '0'}
              </Text>
            </View>
          </View>
        </View>
      )}

      {schedule.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No EMI schedule available</Text>
          <Text style={styles.emptySubtext}>
            EMI schedule will be generated after loan approval
          </Text>
        </View>
      ) : (
        <FlatList
          data={schedule}
          renderItem={renderEmiItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    color: '#7f8c8d',
  },
  header: {
    backgroundColor: '#2c3e50',
    padding: 25,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#ecf0f1',
    marginTop: 5,
  },
  summaryCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: -20,
    marginBottom: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  summaryDetails: {
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emiCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  paidCard: {
    backgroundColor: '#f8fff8',
    borderLeftWidth: 4,
    borderLeftColor: '#2ecc71',
  },
  overdueCard: {
    backgroundColor: '#fff8f8',
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  emiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  emiNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  emiStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  paidStatus: {
    backgroundColor: '#2ecc71',
  },
  pendingStatus: {
    backgroundColor: '#f39c12',
  },
  overdueStatus: {
    backgroundColor: '#e74c3c',
  },
  emiStatusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  dueDate: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 15,
  },
  emiDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  emiDetail: {
    alignItems: 'center',
    flex: 1,
  },
  emiLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  emiValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  totalEmi: {
    color: '#e74c3c',
    fontSize: 18,
  },
  paymentDate: {
    fontSize: 12,
    color: '#2ecc71',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bdc3c7',
    textAlign: 'center',
  },
});

export default EmiScheduleScreen;
