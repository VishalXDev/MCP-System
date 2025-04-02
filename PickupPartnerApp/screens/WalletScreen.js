import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fetchWalletData } from '../services/api'; // Fetch wallet data from the API

const WalletScreen = () => {
  const [walletData, setWalletData] = useState(null);

  useEffect(() => {
    const loadWalletData = async () => {
      const data = await fetchWalletData();
      setWalletData(data);
    };
    loadWalletData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wallet Balance: {walletData ? walletData.balance : 'Loading...'}</Text>
      <Text style={styles.subtitle}>Transactions:</Text>
      {walletData?.transactions.map((transaction, index) => (
        <Text key={index}>{transaction.id} - {transaction.amount}</Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 20,
  },
});

export default WalletScreen;
