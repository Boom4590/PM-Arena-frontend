import React, { useState, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';




import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../UserContext';
import profileImage from '../assets/profile.png';

const BACKEND_URL = 'https://pm-arena-backend-production.up.railway.app';
const MANAGER_WHATSAPP = 'https://wa.me/996507535771'; // ВАШ номер менеджера в формате https://wa.me/номер_без_знаков

export default function Profile({ openAdminPanel }) {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [amountUsd, setAmountUsd] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [payCurrency, setPayCurrency] = useState('btc');
  const navigation = useNavigation();
  const [isError, setIsError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (userInfo?.pubg_id) {
        fetchLatestUserData();
      }
    }, [userInfo?.pubg_id])
  );

 const logout = async () => {
 
  setUserInfo(null);
};


  async function fetchLatestUserData() {
    try {
      const res = await fetch(`${BACKEND_URL}/user?pubg_id=${userInfo.pubg_id}`);
      if (!res.ok) {
        console.log('Ошибка при получении данных пользователя');
        return;
      }
      const updatedUser = await res.json();
      await AsyncStorage.setItem('userInfo', JSON.stringify(updatedUser));
      setUserInfo(updatedUser);
    } catch (error) {
      console.log('Ошибка сервера:', error);
    }
  }

  function tryAdminLogin() {
    if (adminPassword === 'm') {
      openAdminPanel();
      setShowAdminInput(false);
      setAdminPassword('');
    } else {
      Alert.alert('Ошибка', 'Неверный пароль администратора');
    }
  }

  const handleManagerContact = async () => {
    const supported = await Linking.canOpenURL(MANAGER_WHATSAPP);
    if (supported) {
      Linking.openURL(MANAGER_WHATSAPP);
    } else {
      Alert.alert('Ошибка', 'Не удалось открыть WhatsApp');
    }
  };
const confirmLogout = () => {
  
  Alert.alert(
    'Подтверждение',
    'Вы действительно хотите выйти?',
    [
      {
        text: 'Отмена',
        style: 'cancel',
      },
      {
        text: 'Выйти',
        style: 'destructive',
        onPress: () => {
          logout();
        },
      },
    ],
    { cancelable: true }
  );
  
};

  const handlePay = async () => {
    if (!amountUsd) {
      Alert.alert('Введите сумму');
      return;
    }
    const amount = parseFloat(amountUsd);
    if (isNaN(amount) || amount < 13) {
      setIsError(true);
      Alert.alert('Ошибка', 'Сумма должна быть не меньше 13 USD');
      return;
    }
    setIsError(false);

    const pubg_id = userInfo.pubg_id;
    try {
      const response = await fetch(`${BACKEND_URL}/api/payment/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountUsd: Number(amountUsd), payCurrency, pubg_id }),
      });

      const data = await response.json();

      navigation.navigate("CryptoPayment", { invoiceUrl: data.invoice_url });
      console.log(data.invoice_url)

    } catch (e) {
      Alert.alert('Ошибка', e.message);
    }
  };

  if (!userInfo) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notAuthText}>Пользователь не авторизован</Text>
      </View>
    );
  }

  const amountNum = parseFloat(amountUsd);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View>
        <View style={styles.profileRow}>
          <Image source={profileImage} style={styles.image} resizeMode="contain" />
          <View style={styles.dataColumn}>
            <Text style={styles.label}>
              <Text style={styles.labelTitle}>Pubg ID: </Text>
              {userInfo.pubg_id}
            </Text>
            <Text style={styles.label}>
              <Text style={styles.labelTitle}>Никнейм: </Text>
              {userInfo.nickname}
            </Text>
            <Text style={styles.label}>
              <Text style={styles.labelTitle}>
                <FontAwesome name="phone" size={17} color="black"  />
                

                </Text>
                <FontAwesome name="phone" size={10} color="#fff" />
              {userInfo.phone}
            </Text>
          </View>
        </View>

        <View style={styles.balanceRow}>
          <Text style={styles.balanceText}>
            Баланс: <Text style={styles.balanceAmount}>{userInfo.balance} $</Text>
          </Text>
        </View>

        <TextInput
          keyboardType="numeric"
          placeholder="Сумма в USD"
          value={amountUsd}
          onChangeText={setAmountUsd}
          style={[styles.input, isError && styles.inputError]}
          placeholderTextColor="#999"
        />
        <TouchableOpacity onPress={handlePay} style={styles.cryptoBtn}>
  <View style={styles.cryptoContent}>
   
    <Text style={styles.cryptoText}>Пополнить криптой</Text>
     <Image
      source={require('../assets/btc.png')} // Убедитесь, что иконка биткоина есть в этом пути
      style={styles.cryptoIcon}
    />
  </View>
</TouchableOpacity>

        {/* CHANGES: Показать текст и кнопку в зависимости от суммы */}
        {amountUsd && amountNum < 13 ? (
          <TouchableOpacity onPress={handleManagerContact} style={styles.managerContact}>
            <Text style={styles.managerText}>
              Если у вас меньше 13, то{'\n'} можно пополнить через менеджера →
            </Text>
            
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleManagerContact} style={styles.managerBtn}>
  <View style={styles.managerContent}>
    <Text style={styles.managerBtnText}>Оплатить через менеджера</Text>
    <Image
      source={require('../assets/whatsapp.png')} // убедись, что файл есть по этому пути
      style={styles.whatsappIcon}
    />
  </View>
</TouchableOpacity>

        )}

       

       {showAdminInput ? (
  <View>
    <TextInput
      value={adminPassword}
      onChangeText={setAdminPassword}
      placeholder="Введите промокод"
      style={styles.input}
    />
    <View style={styles.adminButtonsRow}>
      <TouchableOpacity onPress={tryAdminLogin} style={styles.adminBtn}>
        <Text style={styles.buttonText}>Подтвердить</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {
        setAdminPassword('');
        setShowAdminInput(false);
      }} style={[styles.adminBtn, styles.cancelBtn]}>
        <Text style={[styles.buttonText, { color: PUBG_DARK_GREEN }]}>Отмена</Text>
      </TouchableOpacity>
    </View>
  </View>
) : (
  <View style={styles.bottomRow}>
    <TouchableOpacity
      onPress={() => setShowAdminInput(true)}
      style={styles.promoLeft}
      activeOpacity={0.7}
    >
      <Text style={styles.promoText}>Промокод</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={logout} /*onPress={confirmLogout}*/ >
      <Text style={styles.logoutText}>Выйти</Text>
    </TouchableOpacity>
  </View>
)}


      </View>
    </ScrollView>
  );
}

const PUBG_DARK_GREEN = '#1B3A2F'; // пример тёмно-зелёного
const PUBG_LIGHT_GREEN = '#2E7D32'; // светлее для акцентов

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 26,
    paddingVertical: 30,
    backgroundColor: '#fff',
  },
  profileRow: {
    borderWidth: 2,
    borderColor: PUBG_DARK_GREEN,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6, // минимальный радиус для угловатости
    marginBottom: 16,
    padding: 18,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 2,
  },
  bottomRow: {
  marginTop: 30,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
promoLeft: {
  flexShrink: 1,
},

  image: {
    width: 90,
    height: 90,
    marginRight: 18,
    borderRadius: 50, // угловатый профиль
    borderWidth: 2,
    borderColor: PUBG_DARK_GREEN,
  },
  dataColumn: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: PUBG_DARK_GREEN,
    fontWeight: '700',
    fontFamily: 'System',
  },
  labelTitle: {
    color: PUBG_LIGHT_GREEN,
  },
  balanceRow: {
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#777',
    width: '60%',
    padding: 10,
    justifyContent:'space-between',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: PUBG_DARK_GREEN,
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 3 },
  },
  balanceText: {
    fontSize: 14,
    fontWeight: '800',
    color: 'black',
  },
  balanceAmount: {
    marginLeft: 14,
    fontSize:15,
    fontWeight: '600',
  },
  input: {
    marginTop:20,
    borderWidth: 2,
    borderColor: PUBG_DARK_GREEN,
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 17,
    color: '#333',
    backgroundColor: '#FAFAFA',
  },
  inputError: {
    borderColor: '#E53935',
  },
  cryptoBtn: {
    backgroundColor: PUBG_DARK_GREEN,
    paddingVertical: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PUBG_DARK_GREEN,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    marginTop: 20,
  },
  cryptoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cryptoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  cryptoIcon: {
    width: 20,
    height: 20,
    marginTop: 2,
    marginLeft:6,
  },
  managerContact: {
    marginTop: 20,
    paddingVertical: 14,
    backgroundColor: PUBG_DARK_GREEN,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  managerText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  managerBtn: {
    backgroundColor: PUBG_LIGHT_GREEN,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PUBG_LIGHT_GREEN,
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    marginTop: 15,
  },
  managerContent: {
    flexDirection: 'row',
  },
  managerBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  whatsappIcon: {
    width: 20,
    height: 20,
    marginTop:2
  },
  promoToggle: {
    marginTop: 30,
    alignItems: 'center',
  },
  promoText: {
    color: PUBG_DARK_GREEN,
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  adminButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 30,
  },
  adminBtn: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 14,
    backgroundColor: PUBG_DARK_GREEN,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PUBG_DARK_GREEN,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  cancelBtn: {
    backgroundColor: '#eee',
    shadowOpacity: 0,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
  },
  logoutButton: {
    marginTop: 45,
    alignItems: 'flex-end',
  },
  logoutText: {
    color: '#D32F2F',
    fontWeight: '700',
    fontSize: 14,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notAuthText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#777',
  },
});

