import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

const BACKEND_URL = 'https://pm-arena-backend-production.up.railway.app';

export default function AdminPanel() {
  const [activeSection, setActiveSection] = useState(null); // null или 'block', 'create', 'lobby', 'delete', 'archive', 'findSeat', 'topup', 'allUsers'
  const [topUpPubgId, setTopUpPubgId] = useState('');
  const [topUpAmount, setTopUpAmount] = useState('');

  const [deleteTournamentId, setDeleteTournamentId] = useState('');
  const [blockPhone, setBlockPhone] = useState('');
  const [pubgId, setBlockPubgId] = useState('');
  const [createMode, setCreateMode] = useState('');
  const [createEntryFee, setCreateEntryFee] = useState('');
  const [createPrizePool, setCreatePrizePool] = useState('');
  const [createStartTime, setCreateStartTime] = useState('');
  const [lobbyTournamentId, setLobbyTournamentId] = useState('');
  const [lobbyRoomId, setLobbyRoomId] = useState('');
  const [lobbyPassword, setLobbyPassword] = useState('');
  const [searchPubgId, setSearchPubgId] = useState('');
  const [foundSeat, setFoundSeat] = useState(null);

  // Для списка всех пользователей
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  async function blockUser() {
    const pubg_id = pubgId;
    try {
      const res = await fetch(`${BACKEND_URL}/admin/block`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pubg_id }),
      });
      if (!res.ok) {
        const json = await res.json();
        Alert.alert('Ошибка', json.error || 'Ошибка блокировки');
        return;
      }
      Alert.alert('Успешно', 'Пользователь заблокирован');
      setBlockPhone('');
      setBlockPubgId('');
    } catch {
      Alert.alert('Ошибка', 'Ошибка сервера');
    }
  }

  async function archiveParticipants() {
    try {
      const res = await fetch(`${BACKEND_URL}/admin/archiveParticipants`, {
        method: 'POST',
      });
      const json = await res.json();

      if (res.ok) {
        Alert.alert('Успех', json.message);
      } else {
        Alert.alert('Ошибка', json.error || 'Не удалось архивировать');
        console.log('Ошибка', json.error || 'Не удалось архивировать');
      }
    } catch (e) {
      Alert.alert('Ошибка', 'Ошибка подключения к серверу');
    }
  }

  async function createTournament() {
    if (
      !createMode.trim() ||
      !createEntryFee.trim() ||
      !createPrizePool.trim() ||
      !createStartTime.trim()
    ) {
      Alert.alert('Ошибка', 'Заполните все поля для создания турнира');
      return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}/admin/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: createMode,
          entry_fee: Number(createEntryFee),
          prize_pool: Number(createPrizePool),
          start_time: createStartTime,
        }),
      });
      if (!res.ok) {
        const json = await res.json();
        Alert.alert('Ошибка', json.error || 'Ошибка создания турнира');
        return;
      }
      Alert.alert('Успешно', 'Турнир создан');
      setCreateMode('');
      setCreateEntryFee('');
      setCreatePrizePool('');
      setCreateStartTime('');
    } catch {
      Alert.alert('Ошибка', 'Ошибка сервера');
    }
  }

  async function deleteTournament() {
    if (!deleteTournamentId.trim()) {
      Alert.alert('Ошибка', 'Введите ID турнира для удаления');
      return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}/admin/delete/${deleteTournamentId}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (res.ok) {
        Alert.alert('Успешно', 'Турнир удалён');
        setDeleteTournamentId('');
      } else {
        Alert.alert('Ошибка', json.error || 'Не удалось удалить турнир');
      }
    } catch (e) {
      Alert.alert('Ошибка', 'Ошибка подключения к серверу');
    }
  }

  async function sendLobby() {
    if (!lobbyTournamentId || !lobbyRoomId || !lobbyPassword) {
      Alert.alert('Ошибка', 'Заполните все поля для отправки лобби');
      return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}/admin/send_lobby`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tournament_id: Number(lobbyTournamentId),
          room_id: lobbyRoomId,
          room_password: lobbyPassword,
        }),
      });
      if (!res.ok) {
        const json = await res.json();
        Alert.alert('Ошибка', json.error || 'Ошибка отправки лобби');
        return;
      }
      Alert.alert('Успешно', 'Данные лобби отправлены');
      setLobbyTournamentId('');
      setLobbyRoomId('');
      setLobbyPassword('');
    } catch {
      Alert.alert('Ошибка', 'Ошибка сервера');
    }
  }

  function toggleSection(sectionName) {
    if (activeSection === sectionName) {
      setActiveSection(null);
    } else {
      setActiveSection(sectionName);
      if (sectionName === 'allUsers') {
        fetchAllUsers();
      }
    }
  }

  async function topUpBalance() {
    if (!topUpPubgId.trim() || !topUpAmount.trim()) {
      Alert.alert('Ошибка', 'Введите PUBG ID и сумму');
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/admin/topup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pubg_id: topUpPubgId,
          amount: Number(topUpAmount),
        }),
      });

      const json = await res.json();
      if (res.ok) {
        Alert.alert('Успешно', json.message || 'Баланс пополнен');
        setTopUpPubgId('');
        setTopUpAmount('');
      } else {
        Alert.alert('Ошибка', json.error || 'Не удалось пополнить баланс');
      }
    } catch {
      Alert.alert('Ошибка', 'Ошибка сервера');
    }
  }

  async function findSeatByPubgId() {
    if (!searchPubgId.trim()) {
      Alert.alert('Ошибка', 'Введите PUBG ID для поиска');
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/admin/find_seat/${searchPubgId}`);
      const json = await res.json();

      if (res.ok) {
        setFoundSeat(json.seat); // ожидается { seat: "A3" } например
      } else {
        Alert.alert('Ошибка', json.error || 'Пользователь не найден');
        setFoundSeat(null);
      }
    } catch {
      Alert.alert('Ошибка', 'Ошибка сервера');
      setFoundSeat(null);
    }
  }

  async function fetchAllUsers() {
    setLoadingUsers(true);
    try {
      const res = await fetch(`${BACKEND_URL}/admin/find_seats`);
      const json = await res.json();

      if (res.ok) {
        setUsersList(json.users || []);
      } else {
        Alert.alert('Ошибка', json.error || 'Не удалось загрузить список пользователей');
        setUsersList([]);
      }
    } catch {
      Alert.alert('Ошибка', 'Ошибка сервера при загрузке списка пользователей');
      setUsersList([]);
    }
    setLoadingUsers(false);
  }

  return (
    <ScrollView style={styles.container}>
      {/* Блокировка пользователя */}
      <TouchableOpacity onPress={() => toggleSection('block')} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Блокировка пользователя по ID</Text>
      </TouchableOpacity>
      {activeSection === 'block' && (
        <View>
          <TextInput
            placeholder="PUBG MOBILE ID"
            value={pubgId}
            onChangeText={(text) => {
              const digitsOnly = text.replace(/[^0-9]/g, '');
              if (digitsOnly.length <= 10) {
                setBlockPubgId(digitsOnly);
              }
            }}
            keyboardType="number-pad"
            maxLength={10}
            style={styles.input}
          />
          <Button title="Заблокировать пользователя" onPress={blockUser} />
        </View>
      )}

      {/* Создание турнира */}
      <TouchableOpacity onPress={() => toggleSection('create')} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Создание турнира</Text>
      </TouchableOpacity>
      {activeSection === 'create' && (
        <View>
          <TextInput
            placeholder="Режим"
            value={createMode}
            onChangeText={setCreateMode}
            style={styles.input}
          />
          <TextInput
            placeholder="Вступительный взнос"
            value={createEntryFee}
            onChangeText={setCreateEntryFee}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="Призовой фонд"
            value={createPrizePool}
            onChangeText={setCreatePrizePool}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInputMask
            type={'datetime'}
            options={{
              format: 'YYYY-MM-DD HH:mm:ss',
            }}
            value={createStartTime}
            onChangeText={setCreateStartTime}
            style={styles.input}
          />
          <Button title="Создать турнир" onPress={createTournament} />
        </View>
      )}

      {/* Отправка данных лобби */}
      <TouchableOpacity onPress={() => toggleSection('lobby')} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Отправка данных лобби</Text>
      </TouchableOpacity>
      {activeSection === 'lobby' && (
        <View>
          <TextInput
            placeholder="ID турнира"
            value={lobbyTournamentId}
            onChangeText={setLobbyTournamentId}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="ID комнаты"
            value={lobbyRoomId}
            onChangeText={setLobbyRoomId}
            style={styles.input}
          />
          <TextInput
            placeholder="Пароль комнаты"
            value={lobbyPassword}
            onChangeText={setLobbyPassword}
            style={styles.input}
          />
          <Button title="Отправить лобби" onPress={sendLobby} />
        </View>
      )}

      {/* Удаление турнира */}
      <TouchableOpacity onPress={() => toggleSection('delete')} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Удаление турнира</Text>
      </TouchableOpacity>
      {activeSection === 'delete' && (
        <View>
          <TextInput
            placeholder="ID турнира"
            value={deleteTournamentId}
            onChangeText={setDeleteTournamentId}
            keyboardType="numeric"
            maxLength={20}
            style={styles.input}
          />
          <Button title="Удалить турнир" onPress={deleteTournament} />
        </View>
      )}

      {/* Архивирование участников */}
      <TouchableOpacity onPress={() => toggleSection('archive')} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Архивировать участников</Text>
      </TouchableOpacity>
      {activeSection === 'archive' && (
        <View style={{ marginVertical: 10 }}>
          <Button title="Архивировать Participants" onPress={archiveParticipants} />
        </View>
      )}

      {/* Найти Seat по PUBG ID */}
      <TouchableOpacity onPress={() => toggleSection('findSeat')} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Найти Seat по PUBG ID</Text>
      </TouchableOpacity>
      {activeSection === 'findSeat' && (
        <View>
          <TextInput
            placeholder="PUBG ID"
            value={searchPubgId}
            onChangeText={setSearchPubgId}
            keyboardType="number-pad"
            maxLength={10}
            style={styles.input}
          />
          <Button title="Найти" onPress={findSeatByPubgId} />
          {foundSeat !== null && (
            <Text style={{ marginTop: 10, fontSize: 16 }}>
              Место (seat): <Text style={{ fontWeight: 'bold' }}>{foundSeat}</Text>
            </Text>
          )}
        </View>
      )}

      {/* Пополнить баланс пользователя */}
      <TouchableOpacity onPress={() => toggleSection('topup')} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Пополнить баланс пользователя</Text>
      </TouchableOpacity>
      {activeSection === 'topup' && (
        <View>
          <TextInput
            placeholder="PUBG ID"
            value={topUpPubgId}
            onChangeText={setTopUpPubgId}
            keyboardType="number-pad"
            maxLength={10}
            style={styles.input}
          />
          <TextInput
            placeholder="Сумма пополнения"
            value={topUpAmount}
            onChangeText={setTopUpAmount}
            maxLength={6}
            keyboardType="numeric"
            style={styles.input}
          />
          <Button title="Пополнить баланс" onPress={topUpBalance} />
        </View>
      )}

      {/* Список всех пользователей */}
      <TouchableOpacity onPress={() => toggleSection('allUsers')} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Список всех пользователей</Text>
      </TouchableOpacity>
      {activeSection === 'allUsers' && (
        <View style={{ marginVertical: 10 }}>
          {loadingUsers ? (
            <Text>Загрузка...</Text>
          ) : usersList.length === 0 ? (
            <Text>Пользователи не найдены</Text>
          ) : (
            
           <FlatList
  data={usersList}
  keyExtractor={(item) => item.pubg_id.toString()}
  ListHeaderComponent={() => (
    <View style={styles.tableHeader}>
    <Text style={[styles.tableCell, styles.headerText, { flex: 1 }]}>Seat</Text>
      <Text style={[styles.tableCell, styles.headerText, { flex: 3 }]}>Nickname</Text>
      <Text style={[styles.tableCell, styles.headerText, { flex: 2 }]}>PUBG ID</Text>
      
    </View>
  )}
  renderItem={({ item, index }) => (
    <View
      style={[
        styles.tableRow,
        { backgroundColor: index % 2 === 0 ? '#1e1e1e' : '#2c2c2c' },
      ]}
    >
      <Text style={[styles.tableCell, { flex: 1 }]}>{item.seat}</Text>
      <Text style={[styles.tableCell, { flex: 3 }]} numberOfLines={1} ellipsizeMode="tail">
        {item.nickname}
      </Text>
      <Text style={[styles.tableCell, { flex: 2 }]}>{item.pubg_id}</Text>
      
    </View>
  )}
/>

          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  sectionHeader: {
    backgroundColor: '#eee',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 15,
    borderRadius: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#ffb800', // насыщенный PUBG жёлтый
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#444', // тёмный разделитель
    alignItems: 'center',
  },
  tableCell: {
    color: '#fff',
    fontSize: 16,
    paddingHorizontal: 6,
  },
  headerText: {
    fontWeight: 'bold',
    color: '#1e1e1e', // тёмный текст на жёлтом фоне
  },

  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 8,
    padding: 10,
  },
  userRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  userText: {
    fontSize: 16,
  },
});
