// LoanDetailScreen.jsx
import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import API_ENDPOINTS from '../services/apiEndpoints';
// import API_ENDPOINTS from '../api/endpoints';

const LoanDetailScreen = ({ route, navigation }) => {
  const { token } = useContext(AuthContext);
  const { loanId } = route.params || {};
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLoanDetails = async () => {
    if (!loanId) {
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching loan details for:', loanId);
      const response = await fetch(
        API_ENDPOINTS.BASE_URL + API_ENDPOINTS.LOAN_DETAIL(loanId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Loan details:', data);
        setLoan(data);
      } else {
        console.error('Failed to fetch loan details:', response.status);
      }
    } catch (error) {
      console.error('Error fetching loan details:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log('LoanDetailScreen focused, fetching details');
      setLoading(true);
      fetchLoanDetails();

      return () => {
        console.log('LoanDetailScreen unfocused');
      };
    }, [loanId, token]),
  );

  // Rest of the component remains the same...

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (!loan) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.noLoanText}>No loan details available</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Loan Details</Text>
        <Text style={styles.loanNumber}>#{loan.loan_number || loan.id}</Text>
      </View>

      <View style={styles.statusContainer}>
        <View
          style={[
            styles.statusIndicator,
            {
              backgroundColor: loan.status === 'active' ? '#2ecc71' : '#e74c3c',
            },
          ]}
        >
          <Text style={styles.statusText}>
            {loan.status?.toUpperCase() || 'PENDING'}
          </Text>
        </View>
        <Text style={styles.statusDate}>
          Applied on: {new Date(loan.created_at).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Loan Information</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Principal Amount</Text>
          <Text style={styles.infoValue}>
            ₹{loan.principal_amount || loan.amount || '0'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Interest Rate</Text>
          <Text style={styles.infoValue}>
            {loan.interest_rate || '0'}% p.a.
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Loan Tenure</Text>
          <Text style={styles.infoValue}>
            {loan.tenure_months || '0'} months
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Monthly EMI</Text>
          <Text style={styles.infoValue}>₹{loan.monthly_emi || '0'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Total Payable</Text>
          <Text style={styles.infoValue}>₹{loan.total_payable || '0'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Remaining Amount</Text>
          <Text style={styles.infoValue}>
            ₹{loan.remaining_amount || loan.amount || '0'}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Next Payment</Text>
        <View style={styles.paymentCard}>
          <Text style={styles.paymentAmount}>
            ₹{loan.next_emi_amount || loan.monthly_emi || '0'}
          </Text>
          <Text style={styles.paymentDue}>
            Due on: {loan.next_due_date || 'Not available'}
          </Text>
          <TouchableOpacity style={styles.payButton}>
            <Text style={styles.payButtonText}>Pay Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.emiScheduleButton}
        onPress={() => navigation.navigate('EmiSchedule', { loanId: loan.id })}
      >
        <Text style={styles.emiScheduleButtonText}>
          View Complete EMI Schedule
        </Text>
      </TouchableOpacity>
    </ScrollView>
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
  loanNumber: {
    fontSize: 16,
    color: '#ecf0f1',
    marginTop: 5,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: -20,
    marginBottom: 20,
  },
  statusIndicator: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  statusDate: {
    color: '#7f8c8d',
    fontSize: 14,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
    paddingBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  paymentCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  paymentAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 10,
  },
  paymentDue: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 15,
  },
  payButton: {
    backgroundColor: '#2ecc71',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 8,
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emiScheduleButton: {
    backgroundColor: '#3498db',
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  emiScheduleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  noLoanText: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoanDetailScreen;
