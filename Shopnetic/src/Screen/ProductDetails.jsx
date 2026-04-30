import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../CartContext';
import { formatINR } from '../utils/formatCurrency';

const ProductDetails = ({ route, navigation }) => {
  const { product } = route.params;
  const { dispatch } = useCart();

 const handleAddToCart = () => {
  dispatch({ type: 'ADD_TO_CART', payload: product });
  navigation.navigate('Tabs', { screen: 'Cart' });
};


  return (
    <SafeAreaView style={styles.detailContainer}>
      <FlatList
        ListHeaderComponent={
          <>
            <Image source={{ uri: product.image }} style={styles.detailImage} />
            <View style={styles.detailInfo}>
              <Text style={styles.detailTitle}>{product.title}</Text>
              <Text style={styles.detailPrice}>{formatINR(product.price)}</Text>
              <Text style={styles.detailDescription}>{product.description}</Text>
            </View>
          </>
        }
        data={[]}
      />

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Ionicons name="cart" size={20} color="#fff" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  detailContainer: { flex: 1, backgroundColor: '#fff' },
  detailImage: { width: '100%', height: 300, resizeMode: 'contain' },
  detailInfo: { padding: 16 },
  detailTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  detailPrice: { fontSize: 24, fontWeight: 'bold', color: '#3498db', marginBottom: 12 },
  detailDescription: { color: '#666', fontSize: 14, lineHeight: 22 },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 16, borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: '#fff'
  },
  addToCartButton: {
    backgroundColor: '#3498db', paddingVertical: 12, borderRadius: 8,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
  },
  addToCartText: { color: '#fff', fontWeight: 'bold', marginLeft: 8 },
});

export default ProductDetails;
