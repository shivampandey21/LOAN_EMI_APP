// MyLoansScreen.jsx
import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import API_ENDPOINTS from '../services/apiEndpoints';

const MyLoansScreen = ({ navigation }) => {
  const { token } = useContext(AuthContext);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLoans = async () => {
    try {
      console.log('Fetching loans...');
      const response = await fetch(
        API_ENDPOINTS.BASE_URL + API_ENDPOINTS.MY_LOANS,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Loans data:', data);
        setLoans(data.loans || []);
      } else {
        console.error('Failed to fetch loans:', response.status);
      }
    } catch (error) {
      console.error('Error fetching loans:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Use useFocusEffect to refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('MyLoansScreen focused, refreshing data');
      setLoading(true);
      fetchLoans();

      // Optional: Return cleanup function
      return () => {
        console.log('MyLoansScreen unfocused');
      };
    }, [token]), // Add dependencies
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchLoans();
  };

  // Rest of the component remains the same...
  // [Keep the renderLoanItem function and styles]

  const renderLoanItem = ({ item }) => (
    <TouchableOpacity
      style={styles.loanCard}
      onPress={() => navigation.navigate('LoanDetail', { loanId: item.id })}
    >
      <View style={styles.loanHeader}>
        <Text style={styles.loanId}>Loan #{item.id || item.loan_number}</Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: item.status === 'active' ? '#2ecc71' : '#e74c3c',
            },
          ]}
        >
          <Text style={styles.statusText}>
            {item.status ? item.status.toUpperCase() : 'PENDING'}
          </Text>
        </View>
      </View>

      <View style={styles.loanDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Amount:</Text>
          <Text style={styles.detailValue}>₹{item.amount || '0'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Interest Rate:</Text>
          <Text style={styles.detailValue}>{item.interest_rate || '0'}%</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Tenure:</Text>
          <Text style={styles.detailValue}>
            {item.tenure_months || '0'} months
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>EMI:</Text>
          <Text style={styles.detailValue}>
            ₹{item.monthly_emi || '0'}/month
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.viewButton}
        onPress={() => navigation.navigate('EmiSchedule', { loanId: item.id })}
      >
        <Text style={styles.viewButtonText}>View EMI Schedule</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading loans...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Loans</Text>
        <Text style={styles.headerSubtitle}>{loans.length} loan(s) found</Text>
      </View>

      {loans.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No loans found</Text>
          <TouchableOpacity style={styles.applyButton}>
            <Text style={styles.applyButtonText}>Apply for a Loan</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={loans}
          renderItem={renderLoanItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#3498db']}
            />
          }
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
  header: {
    backgroundColor: '#2c3e50',
    padding: 20,
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
  listContainer: {
    padding: 15,
  },
  loanCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  loanId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  loanDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  viewButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 20,
  },
  applyButton: {
    backgroundColor: '#2ecc71',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MyLoansScreen;
