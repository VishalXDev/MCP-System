import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { acceptOrder, rejectOrder } from '../services/api'; // API calls for accepting/rejecting orders

const OrderScreen = ({ route }) => {
  const { orderId } = route.params; // Get orderId passed from HomeScreen

  const handleAccept = async () => {
    await acceptOrder(orderId);
  };

  const handleReject = async () => {
    await rejectOrder(orderId);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order ID: {orderId}</Text>
      <Button title="Accept Order" onPress={handleAccept} />
      <Button title="Reject Order" onPress={handleReject} />
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
});
const acceptOrder = async (orderId) => {
  try {
      await axios.post(`${API_URL}/orders/${orderId}/accept`);
      alert("Order accepted successfully!");
  } catch (error) {
      alert("Error accepting order: " + error.message);
  }
};

export default OrderScreen;
