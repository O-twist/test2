import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { CartProvider, useCart } from './src/context/CartContext';
import RegisterScreen from './src/screens/RegisterScreen';
import ProductListScreen from './src/screens/ProductListScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CartScreen from './src/screens/CartScreen';
import { TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Stack = createStackNavigator();


const CartIcon = () => {
  const { cart } = useCart();
  const navigation = useNavigation();
  
  return (
    <TouchableOpacity 
      style={styles.cartIcon}
      onPress={() => navigation.navigate('Cart')}
    >
      <Text style={styles.cartCount}>
        {cart.reduce((total, item) => total + item.quantity, 0)}
      </Text>
      <Text style={styles.cartText}>🛒</Text>
    </TouchableOpacity>
  );
};

const AppNavigator = () => {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen 
              name="ProductList" 
              component={ProductListScreen}
              options={{ 
                title: 'ShopEZ Products',
                headerRight: () => <CartIcon />
              }}
            />
            <Stack.Screen 
              name="ProductDetail" 
              component={ProductDetailScreen}
              options={{ title: 'Product Details' }}
            />
            <Stack.Screen 
              name="Cart" 
              component={CartScreen}
              options={{ title: 'Your Cart' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppNavigator />
      </CartProvider>
    </AuthProvider>
  );
}

const styles = {
  cartIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  cartCount: {
    backgroundColor: 'red',
    color: 'white',
    borderRadius: 10,
    paddingHorizontal: 5,
    marginRight: 5,
    fontSize: 12,
    fontWeight: 'bold',
  },
  cartText: {
    fontSize: 20,
  },
};