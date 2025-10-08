import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useCart } from '../context/CartContext';

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const [addingToCart, setAddingToCart] = useState(false);
  const { addToCart, cart } = useCart();

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      await addToCart(product);
      Alert.alert('Success', 'Product added to cart!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add product to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const isInCart = cart.some(item => item.productId === product.id);

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      
      <View style={styles.content}>
        <Text style={styles.title}>{product.title}</Text>
        
        <View style={styles.priceRatingContainer}>
          <Text style={styles.price}>${product.price}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {product.rating?.rate || 'N/A'}</Text>
            <Text style={styles.ratingCount}>({product.rating?.count || 0} reviews)</Text>
          </View>
        </View>

        <View style={styles.categoryContainer}>
          <Text style={styles.category}>{product.category}</Text>
        </View>

        <Text style={styles.description}>{product.description}</Text>

        <TouchableOpacity 
          style={[
            styles.addToCartButton,
            isInCart && styles.addedToCartButton
          ]}
          onPress={handleAddToCart}
          disabled={addingToCart || isInCart}
        >
          {addingToCart ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.addToCartText}>
              {isInCart ? 'Added to Cart' : 'Add to Cart'}
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.features}>
          <Text style={styles.featuresTitle}>Product Features</Text>
          <View style={styles.featureItem}>
            <Text style={styles.featureDot}>•</Text>
            <Text style={styles.featureText}>Free shipping on orders over $50</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureDot}>•</Text>
            <Text style={styles.featureText}>30-day return policy</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureDot}>•</Text>
            <Text style={styles.featureText}>Secure payment processing</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    backgroundColor: 'white',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    lineHeight: 28,
  },
  priceRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007bff',
  },
  ratingContainer: {
    alignItems: 'flex-end',
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  ratingCount: {
    fontSize: 12,
    color: '#6c757d',
  },
  categoryContainer: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  category: {
    fontSize: 14,
    color: '#495057',
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    marginBottom: 30,
  },
  addToCartButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  addedToCartButton: {
    backgroundColor: '#28a745',
  },
  addToCartText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  features: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  featureDot: {
    color: '#007bff',
    fontSize: 16,
    marginRight: 10,
    marginTop: 2,
  },
  featureText: {
    fontSize: 14,
    color: '#555',
    flex: 1,
    lineHeight: 20,
  },
});

export default ProductDetailScreen;