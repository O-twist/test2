// src/context/CartContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { ref, set, onValue, update, remove } from 'firebase/database';
import { database } from '../services/firebase';
import { useAuth } from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    let unsubscribe;

    const initializeCart = () => {
      if (user) {
        // Load from Firebase when user is logged in
        unsubscribe = loadCartFromFirebase();
      } else {
        // Load from local storage when no user
        loadCartFromLocal();
      }
    };

    initializeCart();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  const loadCartFromFirebase = () => {
    if (!user) return;

    const cartRef = ref(database, `carts/${user.uid}`);
    
    const unsubscribe = onValue(cartRef, (snapshot) => {
      const data = snapshot.val();
      let cartItems = [];
      
      if (data) {
        cartItems = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
      }
      
      setCart(cartItems);
      // Sync to local storage for offline use
      AsyncStorage.setItem('cart', JSON.stringify(cartItems));
      setLoading(false);
    });

    return unsubscribe;
  };

  const loadCartFromLocal = async () => {
    try {
      const localCart = await AsyncStorage.getItem('cart');
      if (localCart) {
        setCart(JSON.parse(localCart));
      }
    } catch (error) {
      console.error('Error loading local cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      await updateQuantity(existingItem.id, existingItem.quantity + 1);
    } else {
      const newItem = {
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
        addedAt: Date.now()
      };

      if (user) {
        // Save to Firebase
        const newItemRef = ref(database, `carts/${user.uid}/${Date.now()}`);
        await set(newItemRef, newItem);
      } else {
        // Save to local storage only
        const updatedCart = [...cart, { ...newItem, id: Date.now().toString() }];
        setCart(updatedCart);
        await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
      }
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    if (user) {
      // Update in Firebase
      const itemRef = ref(database, `carts/${user.uid}/${itemId}`);
      await update(itemRef, { quantity: newQuantity });
    } else {
      // Update in local storage
      const updatedCart = cart.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCart(updatedCart);
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  const removeFromCart = async (itemId) => {
    if (user) {
      // Remove from Firebase
      const itemRef = ref(database, `carts/${user.uid}/${itemId}`);
      await remove(itemRef);
    } else {
      // Remove from local storage
      const updatedCart = cart.filter(item => item.id !== itemId);
      setCart(updatedCart);
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  const clearCart = async () => {
    if (user) {
      // Clear from Firebase
      const cartRef = ref(database, `carts/${user.uid}`);
      await remove(cartRef);
    } else {
      // Clear from local storage
      setCart([]);
      await AsyncStorage.removeItem('cart');
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};