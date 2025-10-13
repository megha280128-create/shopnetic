import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../CartContext';

const CartScreen = ({ navigation }) => {
  const { cartItems, total, dispatch } = useCart();

  const handleIncrease = (item) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      const updatedItem = { ...item, quantity: item.quantity - 1 };
      dispatch({ type: 'UPDATE_CART_ITEM', payload: updatedItem });
    } else {
      dispatch({ type: 'REMOVE_FROM_CART', payload: item.id });
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text numberOfLines={1} style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>

        <View style={styles.qtyRow}>
          <TouchableOpacity onPress={() => handleDecrease(item)}>
            <Ionicons name="remove-circle-outline" size={24} color="#3498db" />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => handleIncrease(item)}>
            <Ionicons name="add-circle-outline" size={24} color="#3498db" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item.id })}
      >
        <Ionicons name="trash-outline" size={22} color="red" />
      </TouchableOpacity>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={60} color="#aaa" />
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <TouchableOpacity
          style={styles.shopNowButton}
          onPress={() => navigation.navigate('Tabs', { screen: 'Home' })}
        >
          <Text style={styles.shopNowText}>Shop Now</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <View style={styles.totalBar}>
        <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  image: { width: 60, height: 60, resizeMode: 'contain', marginRight: 12 },
  info: { flex: 1 },
  title: { fontSize: 15, fontWeight: '500', color: '#333' },
  price: { color: '#3498db', fontWeight: 'bold', marginVertical: 4 },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyText: { fontSize: 16, fontWeight: '600', marginHorizontal: 8 },

  totalBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 10,
  },
  totalText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  checkoutButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  checkoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { marginVertical: 10, color: '#777', fontSize: 16 },
  shopNowButton: { backgroundColor: '#3498db', padding: 12, borderRadius: 8 },
  shopNowText: { color: '#fff', fontWeight: 'bold' },
});

export default CartScreen;
