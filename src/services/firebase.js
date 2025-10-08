import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getDatabase } from "firebase/database";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAag1t0aPOOlTTKPtzKGnsIuJ_txEp5KzQ",
  authDomain: "test2-fedc1.firebaseapp.com",
  databaseURL: "https://test2-fedc1-default-rtdb.firebaseio.com", 
  projectId: "test2-fedc1",
  storageBucket: "test2-fedc1.firebasestorage.app",
  messagingSenderId: "211622125519",
  appId: "1:211622125519:web:4399f27d7168548ce47cba"
};

const app = initializeApp(firebaseConfig);


export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const database = getDatabase(app);