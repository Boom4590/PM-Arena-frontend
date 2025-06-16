import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const savedUser = await AsyncStorage.getItem('userInfo');
        if (savedUser) setUserInfo(JSON.parse(savedUser));
      } catch (e) {
        console.log('Ошибка загрузки userInfo:', e);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  useEffect(() => {
    async function saveUser() {
      try {
        if (userInfo) {
          await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        } else {
          await AsyncStorage.removeItem('userInfo');
        }
      } catch (e) {
        console.log('Ошибка сохранения userInfo:', e);
      }
    }
    saveUser();
  }, [userInfo]);

  if (loading) {
    return null; // или спиннер, или заглушка загрузки
  }

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
}
