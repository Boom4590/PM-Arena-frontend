import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { enableScreens } from 'react-native-screens';
enableScreens(true);

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import InstructionScreen from './screens/InstructionScreen';
import CryptoPaymentScreen from './screens/CryptoPaymentScreen';
import AuthScreen from './screens/AuthScreen';
import Tournaments from './screens/TournamentsScreen';
import CurrentTournament from './screens/CurrentTournamentScreen';
import Profile from './screens/ProfileScreen';
import AdminPanel from './screens/AdminPanelScreen';
import LobbyScreen from './screens/LobbyScreen';

import { UserProvider, UserContext } from './UserContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HeaderRight({ navigation }) {
  return (
    <View style={styles.headerRight}>
      <TouchableOpacity style={styles.logoBox} onPress={() => navigation.navigate('Instruction')}>
        <Text style={styles.headerText}>PM Arena</Text>
        <Ionicons name="game-controller" size={22} color={styles.accentColor.color} style={{ marginLeft: 6 }} />
      </TouchableOpacity>
    </View>
  );
}

function TabScreens({ navigation }) {
  const { userInfo, setUserInfo } = useContext(UserContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerRight: () => <HeaderRight navigation={navigation} />,
        tabBarIcon: ({ color, size }) => {
          let iconName = 'ios-help';
          if (route.name === 'Tournaments') iconName = 'list';
          else if (route.name === 'Current') iconName = 'timer';
          else if (route.name === 'Profile') iconName = 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: styles.accentColor.color,
        tabBarInactiveTintColor: 'gray',
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 2,
          borderTopColor: styles.accentColor.color,
          elevation: 10,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          height: 60,
          paddingBottom: 6,
        },
        tabBarLabelStyle: {
          fontWeight: '700',
          fontSize: 12,
          letterSpacing: 0.5,
        },
        headerStyle: {
          backgroundColor: '#fff',
          borderBottomWidth: 2,
          borderBottomColor: styles.accentColor.color,
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
          color: styles.accentColor.color,
        },
      })}
    >
      <Tab.Screen name="Tournaments" component={Tournaments} options={{ title: 'Турниры' }} />
      <Tab.Screen name="Current" component={CurrentTournament} options={{ title: 'Текущий турнир' }} />
      <Tab.Screen name="Profile" options={{ title: 'Профиль' }}>
        {({ navigation }) => (
          <Profile
            user={userInfo}
            setUser={setUserInfo}
            openAdminPanel={() => navigation.navigate('Admin')}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

function MainApp() {
  const { userInfo } = useContext(UserContext);

  if (userInfo === null) {
    return <AuthScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({ navigation }) => ({
          animation: 'slide_from_bottom',
          animationDuration: 300,
          headerRight: () => <HeaderRight navigation={navigation} />,
          headerStyle: {
            backgroundColor: '#fff',
            borderBottomWidth: 2,
            borderBottomColor: styles.accentColor.color,
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
            color: styles.accentColor.color,
          },
        })}
      >
        <Stack.Screen
          name="Main"
          component={TabScreens}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Admin" component={AdminPanel} options={{ title: 'Админ-панель' }} initialParams={{ user: userInfo }} />
        <Stack.Screen name="Instruction" component={InstructionScreen} options={{ title: 'Правила' }} />
        <Stack.Screen name="CryptoPayment" component={CryptoPaymentScreen} options={{ title: 'Оплата' }} />
        <Stack.Screen name="Lobby" component={LobbyScreen} options={{ title: 'Лобби' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  accentColor: {
    color: '#1E3D23',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  logoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    shadowColor: '#1E3D23',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  headerText: {
    fontWeight: '700',
    fontSize: 16,
    color: '#1E3D23',
    letterSpacing: 1,
  },
});

export default function App() {
  return (
    <UserProvider>
      <MainApp />
    </UserProvider>
  );
}
