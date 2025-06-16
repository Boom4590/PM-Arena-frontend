import React, { useEffect, useState, useRef, useContext } from 'react';
import { View, Text, Image,Animated, StyleSheet, Alert } from 'react-native';
import { UserContext } from '../UserContext';
import * as Clipboard from 'expo-clipboard';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Linking } from 'react-native';

const BACKEND_URL = 'https://pm-arena-backend-production.up.railway.app';
export default function CurrentTournament() {
  const { userInfo } = useContext(UserContext);
  const [tournament, setTournament] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [lobbyVisible, setLobbyVisible] = useState(false);
  const [lobbyCountdown, setLobbyCountdown] = useState(null);
  const navigation = useNavigation();
  const timerRef = useRef(null);
  const pollingRef = useRef(null);
  const lobbyTimerRef = useRef(null);
  const [startTime, setStartTime] = useState(null);

  const opacity = useRef(new Animated.Value(1)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(colorAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(colorAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const interpolatedColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#1E90FF', '#00BFFF'],
  });

  function clearTimers() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function clearLobbyTimer() {
    if (lobbyTimerRef.current) {
      clearInterval(lobbyTimerRef.current);
      lobbyTimerRef.current = null;
    }
  }

  function copyToClipboard(text) {
    Clipboard.setStringAsync(text);
  }

  async function fetchCurrentTournament() {
    try {
      if (!userInfo?.pubg_id) return;

      const res = await fetch(`${BACKEND_URL}/current`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pubg_id: userInfo.pubg_id }),
      });

      if (!res.ok) throw new Error('Нет текущего турнира');

      const data = await res.json();

      if (!data || Object.keys(data).length === 0) {
        setTournament(null);
        setLobbyVisible(false);
        setTimeLeft(null);
        setLobbyCountdown(null);
        clearLobbyTimer();
        return;
      }

      setTournament(data);

      const startTimeObj = new Date(data.start_time);
      const now = new Date();
      const diffSec = Math.floor((startTimeObj - now) / 1000);
      const timeToStart = diffSec > 0 ? diffSec : 0;

      setTimeLeft(timeToStart);
      setStartTime(startTimeObj.getTime());

      clearLobbyTimer();
      const lobbyKey = `lobbyShown_${userInfo.pubg_id}_${data.id}`;
      const lobbyStartKey = `lobbyStart_${userInfo.pubg_id}_${data.id}`;

      const storedLobbyShown = await AsyncStorage.getItem(lobbyKey);
      const storedLobbyStart = await AsyncStorage.getItem(lobbyStartKey);

      if (storedLobbyShown === 'true') {
        setLobbyVisible(true);
        setLobbyCountdown(null);
        return;
      }

      if (data.room_id && data.room_password && data.seat != null) {
        const delaySeconds = data.seat * 5;

        if (storedLobbyStart) {
          const lobbyStartTime = parseInt(storedLobbyStart, 10);
          const elapsed = Math.floor((Date.now() - lobbyStartTime) / 1000);
          const remaining = delaySeconds - elapsed;

          if (remaining <= 0) {
            setLobbyVisible(true);
            setLobbyCountdown(null);
            await AsyncStorage.setItem(lobbyKey, 'true');
          } else {
            setLobbyCountdown(remaining);

            lobbyTimerRef.current = setInterval(async () => {
              setLobbyCountdown((prev) => {
                if (prev === 1) {
                  clearLobbyTimer();
                  setLobbyVisible(true);
                  AsyncStorage.setItem(lobbyKey, 'true');
                  AsyncStorage.removeItem(lobbyStartKey);
                  return null;
                }
                return prev - 1;
              });
            }, 1000);
          }
        } else {
          setLobbyCountdown(delaySeconds);
          await AsyncStorage.setItem(lobbyStartKey, Date.now().toString());

          lobbyTimerRef.current = setInterval(async () => {
            setLobbyCountdown((prev) => {
              if (prev === 1) {
                clearLobbyTimer();
                setLobbyVisible(true);
                AsyncStorage.setItem(lobbyKey, 'true');
                AsyncStorage.removeItem(lobbyStartKey);
                return null;
              }
              return prev - 1;
            });
          }, 1000);
        }
      } else {
        setLobbyVisible(false);
        setLobbyCountdown(null);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Ошибка', 'Не удалось загрузить текущий турнир');
      setTournament(null);
      setLobbyVisible(false);
      setTimeLeft(null);
      setLobbyCountdown(null);
      clearLobbyTimer();
    }
  }

  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.floor((startTime - now) / 1000);
      setTimeLeft(diff > 0 ? diff : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  useEffect(() => {
  if (!userInfo || !userInfo.pubg_id) {
    setTournament(null);
    setLobbyVisible(false);
    setTimeLeft(null);
    setLobbyCountdown(null);
    clearTimers();
    clearLobbyTimer();
    return;
  }

  fetchCurrentTournament(); // сразу при монтировании

  // Периодический опрос
  pollingRef.current = setInterval(fetchCurrentTournament, 20000);

  // Подписка на фокус экрана — обновляем данные при переключении на экран
  const unsubscribe = navigation.addListener('focus', () => {
    fetchCurrentTournament();
  });

  // Очистка подписок и таймеров при размонтировании
  return () => {
    clearTimers();
    clearLobbyTimer();
    if (pollingRef.current) clearInterval(pollingRef.current);
    unsubscribe(); // отписка от события focus
  };
}, [userInfo, navigation]);


  const openLobby = () => {
    navigation.navigate('Lobby', {
      currentUserSlot: tournament.seat,
    });
  };
const openLobbyPubg = () => {
  const url = 'com.pubg.imobile://';

  Linking.canOpenURL(url).then((supported) => {
    if (supported) {
      Linking.openURL(url);
    } else {
      Alert.alert('Ошибка', 'Приложение PUBG Mobile не установлено на устройстве');
    }
  });
};

  if (!tournament) {
    return (
      <View style={styles.container}>
        <Text style={styles.noTournamentText}>У вас нет текущего турнира.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Турнир #{tournament.id}
        <TouchableOpacity
          style={styles.rulesButton}
          onPress={() => navigation.navigate('Instruction')}
        >
          <Text>ℹ️</Text>
        </TouchableOpacity>
      </Text>

      {timeLeft !== null && (
        <View style={styles.timerBox}>
          <Text style={styles.timerLabel}>Осталось:</Text>
          <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
        </View>
      )}

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Режим: <Text style={styles.infoBold}>{tournament.mode}</Text>
        </Text>
        <Text style={styles.infoText}>
          Начало:{' '}
          <Text style={styles.infoBold}>
            {new Date(tournament.start_time).toLocaleString()}
          </Text>
        </Text>
        <Text style={styles.infoText}>
          Ваше место:{' '}
          <Text style={styles.infoBold2}>{tournament.seat}</Text>
          
        </Text>
        <TouchableOpacity onPress={openLobby} style={[styles.animatedButtonWrapper,{borderColor: interpolatedColor}]}>
  <Animated.Text style={[styles.animatedButtonText, { color: interpolatedColor}]}>
    Посмотреть мой слот
  </Animated.Text>
</TouchableOpacity>

      </View>

      {!lobbyVisible && lobbyCountdown !== null && (
        <View style={styles.lobbyCountdownBox}>
          <Text style={styles.lobbyCountdownText}>
            Лобби появится через: {lobbyCountdown} сек
          </Text>
        </View>
      )}

      {lobbyVisible && (
        <View style={styles.lobbyBox}>
         
  <View style={styles.lobbyHeader}>
      <Image
        source={require('../assets/pubger.png')}
        style={styles.lobbyIcon}
        resizeMode="contain"
      />
      <Text style={styles.lobbyHeaderText}>Данные лобби</Text>
    </View>
          <View style={styles.copyRow}>
            <Text style={styles.lobbyLabel}>Комната:</Text>
            <Text style={styles.lobbyValue}>{tournament.room_id}</Text>
            <TouchableOpacity onPress={() => copyToClipboard(tournament.room_id)}>
              <MaterialIcons name="content-copy" size={17} color="#444" />
            </TouchableOpacity>
          </View>

          <View style={styles.copyRow}>
            <Text style={styles.lobbyLabel}>Пароль:</Text>
            <Text style={styles.lobbyValue}>{tournament.room_password}</Text>
            <TouchableOpacity onPress={() => copyToClipboard(tournament.room_password)}>
              <MaterialIcons name="content-copy" size={17} color="444" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.enterLobbyButton} onPress={openLobbyPubg}>
            <Text style={styles.enterLobbyButtonText}>Открыть Pubg Mobile</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function formatTime(sec) {
  if (sec == null) return '';
  const days = Math.floor(sec / (3600 * 24));
  const hours = Math.floor((sec % (3600 * 24)) / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = sec % 60;

  const dayStr = days > 0 ? `${days}д ` : '';
  return `${dayStr}${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
  },
  animatedButtonWrapper: {
  backgroundColor: '#fff',
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 6,
  borderWidth:1.6,
borderColor:'blue',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 12,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
  elevation: 3,
},
animatedButtonText: {
  fontSize: 14,
  fontWeight: 'bold',
  letterSpacing: 1,
},

   enterLobbyButton: {
    backgroundColor: '#666',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  enterLobbyButtonText: {
    color: '#f1c40f', // Золотистый стиль PUBG
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
    lobbyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent:'center'
  },
  lobbyIcon: {
    width: 69,
    height: 69,
    borderRadius:50,
    position:'absolute',
   left:30,
   marginTop:10
    
  },
  lobbyHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  title: {
    fontSize: 20,
    marginTop:16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    color: '#2c3e50',
  },
  timerBox: {
    backgroundColor: '#fff',
    borderLeftWidth: 3,
    borderLeftColor: '#e74c3c',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
    minWidth: 140,
  },
  timerLabel: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  timer: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  infoBox: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Для Android
    elevation: 3,
  
    
  },
  infoText: {
    fontSize: 12,
    color: '#34495e',
    marginBottom: 4,
  },
  infoBold: {
    fontWeight: '600',
    color: '#333333',
    
  },
    infoBold2: {
    fontWeight: '800',
    color: '#000',
    width:6,
    marginLeft:4
  },
  lobbyBox: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Для Android
    elevation: 5,
  },
  lobbyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2980b9',
    marginBottom: 10,
  },
  copyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  lobbyLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2c3e50',
    width: 70,
  },
  lobbyValue: {
    fontSize: 12,
    color: '#2c3e50',
    flex: 1,
  },
  lobbyCountdownBox: {
    backgroundColor: '#fff',
    borderLeftWidth: 3,
    borderLeftColor: '#2980b9',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
    minWidth: 180,
  },
  lobbyCountdownText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2980b9',
  },
  noTournamentText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 30,
  },
  imagePlaceholder: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    height: 30,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#fff',
  },
 infoButton: {
  marginLeft: 20,

}
,
  rulesButton: {
    
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 20,
    alignItems: 'center',
  },
 
  rulesButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize:8,
  },
  text:{
fontWeight:'600'
  }
});

