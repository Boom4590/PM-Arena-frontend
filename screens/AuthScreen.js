import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../UserContext';

const BACKEND_URL = 'http://192.168.0.110:3000';

export default function AuthScreen() {
  const { setUserInfo } = useContext(UserContext);

  const [isRegister, setIsRegister] = useState(true);
  const [pubg_id, setPubgId] = useState('');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorPubgId, setErrorPubgId] = useState('');

  const handlePubgIdChange = (text) => {
    const digitsOnly = text.replace(/[^0-9]/g, '');
    if (digitsOnly.length <= 10) {
      setPubgId(digitsOnly);
      if (errorPubgId) setErrorPubgId('');
    }
  };

  async function register() {
    if (!pubg_id || pubg_id.length !== 10) {
      setErrorPubgId('Введите корректный PUBG MOBILE ID');
      return;
    }
    if (!nickname || !phone || !password) {
      setErrorPubgId('');
      alert('Заполните все поля');
      return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pubg_id, nickname, phone, password }),
      });
      if (!res.ok) {
        const json = await res.json();
        alert(json.error || 'Ошибка регистрации');
        return;
      }
      alert('Регистрация прошла успешно. Войдите в аккаунт.');

      setIsRegister(false);

      setPubgId('');
      setPassword('');
      setNickname('');
      setPhone('');
    } catch (e) {
      alert('Сервер недоступен');
    }
  }

  async function login() {
    if (!pubg_id || pubg_id.length !== 10) {
      setErrorPubgId('Введите корректный PUBG MOBILE ID');
      return;
    }
    if (!password) {
      setErrorPubgId('');
      alert('Заполните PUBG ID и пароль');
      return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pubg_id, password }),
      });
      if (!res.ok) {
        const json = await res.json();
        if (res.status === 403) {
          alert(json.error || 'Ошибка авторизации');
          alert('Вы заблокированы и не можете войти в аккаунт.');
        } else {
          alert(json.error || 'Ошибка авторизации');
        }
        return;
      }

      const data = await res.json();
      await AsyncStorage.setItem('loginSuccess', JSON.stringify(data.success));
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      setUserInfo(data.user);
      console.log('User logged in:', data.user);
    } catch (e) {
      alert('Сервер недоступен');
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: BACKGROUND }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>{isRegister ? 'Регистрация' : 'Вход'}</Text>

          <Text style={styles.label}>PUBG MOBILE ID</Text>
          <TextInput
            style={[styles.input, errorPubgId ? styles.inputError : null]}
            placeholder="Введите PUBG ID"
            value={pubg_id}
            keyboardType="number-pad"
            maxLength={10}
            onChangeText={handlePubgIdChange}
            placeholderTextColor="#999"
          />
          {!!errorPubgId && <Text style={styles.errorText}>{errorPubgId}</Text>}

          {isRegister && (
            <>
              <Text style={styles.label}>Никнейм</Text>
              <TextInput
                style={styles.input}
                placeholder="Введите никнейм"
                value={nickname}
                onChangeText={setNickname}
                placeholderTextColor="#999"
              />

              <Text style={styles.label}>Номер телефона</Text>
              <TextInput
                style={styles.input}
                placeholder="Введите номер телефона"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                placeholderTextColor="#999"
              />
            </>
          )}

          <Text style={styles.label}>Пароль</Text>
          <TextInput
            style={styles.input}
            placeholder="Введите пароль"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#999"
          />

          <Pressable
            onPress={isRegister ? register : login}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>{isRegister ? 'Зарегистрироваться' : 'Войти'}</Text>
          </Pressable>

          <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
            <Text style={styles.switch}>
              {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const ACCENT_COLOR = '#2f4f4f'; // темно-зеленый/оливковый
const ACCENT_DARK = '#1e2f2f'; // темный оттенок для кнопки
const BACKGROUND = '#fff';

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingVertical: 30,
    backgroundColor: BACKGROUND,
  },
  card: {
    backgroundColor: BACKGROUND,
    borderRadius: 12,
    padding: 25,
    elevation: 8,
    shadowColor: ACCENT_DARK,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },

    borderWidth: 2,
    borderColor: ACCENT_COLOR,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: ACCENT_COLOR,
    marginBottom: 25,
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  label: {
    fontWeight: '700',
    color: ACCENT_COLOR,
    marginTop: 12,
    marginBottom: 6,
    fontSize: 14,
    letterSpacing: 1,
  },
  input: {
    borderWidth: 2,
    borderColor: '#aaa',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#222',
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 3,
    marginBottom: 6,
    fontWeight: '700',
    fontSize: 12,
    marginLeft: 4,
  },
  button: {
    marginTop: 24,
    backgroundColor: ACCENT_COLOR,
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    shadowColor: ACCENT_DARK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  buttonPressed: {
    backgroundColor: ACCENT_DARK,
  },
  buttonText: {
    color: 'white',
    fontWeight: '900',
    fontSize: 17,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  switch: {
    marginTop: 18,
    color: ACCENT_COLOR,
    fontWeight: '600',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
});
