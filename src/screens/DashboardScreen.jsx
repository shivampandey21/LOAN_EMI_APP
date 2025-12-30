// DashboardScreen.jsx
import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';

const DashboardScreen = ({ navigation }) => {
  const { logout, user } = useContext(AuthContext);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome to Dashboard</Text>
        {user && (
          <Text style={styles.userText}>Hello, {user.name || user.email}</Text>
        )}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Active Loans</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>₹0</Text>
          <Text style={styles.statLabel}>Total Due</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Closed Loans</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => navigation.navigate('MyLoans')}
        >
          <Text style={styles.menuTitle}>📋 My Loans</Text>
          <Text style={styles.menuDescription}>
            View all your loan applications
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => navigation.navigate('LoanDetail')}
        >
          <Text style={styles.menuTitle}>💰 Loan Details</Text>
          <Text style={styles.menuDescription}>
            Check loan details and status
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => navigation.navigate('EmiSchedule')}
        >
          <Text style={styles.menuTitle}>📅 EMI Schedule</Text>
          <Text style={styles.menuDescription}>View payment schedule</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuCard, styles.newLoanCard]}
          onPress={() => navigation.navigate('MyLoans')} // Will update to NewLoan screen
        >
          <Text style={styles.menuTitle}>➕ Apply New Loan</Text>
          <Text style={styles.menuDescription}>Apply for a new loan</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2c3e50',
    padding: 25,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  userText: {
    fontSize: 16,
    color: '#ecf0f1',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: -30,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    width: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 5,
    textAlign: 'center',
  },
  menuContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  menuCard: {
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
  newLoanCard: {
    backgroundColor: '#3498db',
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  newLoanCardmenuTitle: {
    color: 'white',
  },
  menuDescription: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  newLoanCardmenuDescription: {
    color: 'rgba(255,255,255,0.9)',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    marginHorizontal: 20,
    marginVertical: 30,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DashboardScreen;
