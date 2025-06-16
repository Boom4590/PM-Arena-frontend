import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';
export default function InstructionScreen() {
  const navigation = useNavigation()

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Image source={require('../assets/chiken.jpg')} style={styles.topImage} />

      <Text style={styles.title}>📌 Правила участия в турнире</Text>

      {/* Rewards Section - NOW FIRST */}
      <View style={[styles.section, styles.sectionGold]}>
        <Text style={styles.sectionTitle}>🏆 Награды и правила получения:</Text>
        <Text style={styles.text}>• Деньги отправляются победителям в течение <Text style={styles.bold}>6–12 часов</Text> после проверки на читы и честную игру.</Text>
        <Text style={styles.text}>• Победителю будет написано на <Text style={styles.bold}>WhatsApp</Text> по номеру, с которым он проходил регистрацию.</Text>
        <Text style={styles.text}>• Если номер недоступен или был указан неверно — <Text style={styles.bold}>игрок обязан сам</Text> написать менеджеру и подтвердить, что аккаунт принадлежит ему.</Text>
        <Text style={[styles.text, styles.red]}>• Если игрок попал в лобби без оплаты (по чужому ID/паролю) и победил — <Text style={styles.bold}>награда не выдаётся</Text>, и он <Text style={styles.bold}>получает пожизненный бан</Text>.</Text>
      </View>

      {/* Section 1 */}
      <View style={[styles.section, styles.sectionRed]}>
        <Text style={styles.sectionTitle}>1. За следующие нарушения — пожизненный бан:</Text>
        <View style={styles.bulletList}>
          <Text style={[styles.text, styles.red]}>• Игра с эмулятора</Text>
          <Text style={[styles.text, styles.red]}>• Использование читов или стороннего ПО</Text>
          <Text style={[styles.text, styles.red]}>• Использование багов (застревание в текстурах и др.)</Text>
          <Text style={[styles.text, styles.yellow]}>• Тиминг (командная игра в SOLO-турнире)</Text>
          <Text style={[styles.text, styles.yellow]}>• Занятие чужого слота в лобби</Text>
          <Text style={[styles.text, styles.yellow]}>• Передача ID и пароля лобби другим</Text>
        </View>
      </View>

      {/* Section 2 */}
      <View style={[styles.section, styles.sectionGray]}>
        <Text style={styles.sectionTitle}>2. Если вы заняли не свой слот:</Text>
        <Text style={styles.text}>• Вы будете исключены, но можете вернуться на своё место до начала матча</Text>
      </View>

      {/* Section 3 */}
      <View style={[styles.section, styles.sectionGray]}>
        <Text style={styles.sectionTitle}>3. После входа в лобби и занятия слота:</Text>
        <Text style={styles.text}>• Нельзя выходить или менять место</Text>
        <Text style={styles.text}>• Если матч начнётся без вас — билет не возвращается</Text>
      </View>

      {/* Section 4 */}
      <View style={[styles.section, styles.sectionGray]}>
        <Text style={styles.sectionTitle}>4. Если не удалось зайти в лобби:</Text>
        <Text style={styles.text}>• Обратитесь в поддержку WhatsApp и объясните ситуацию</Text>
        <Text style={styles.text}>• При подтверждении причины — билет вернётся</Text>
      </View>

      {/* Images */}
      <View style={styles.imageRow}>
        <View style={styles.imageWrapper}>
          <Image source={require('../assets/image1.jpg')} style={styles.image} />
        </View>
        <View style={styles.imageWrapper}>
          <Image source={require('../assets/image2.jpeg')} style={styles.image} />
        </View>
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Понятно</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0', // изменено с белого на мягкий светло-серый
    paddingHorizontal: 20,
    flex: 1,
  },
  topImage: {
    width: '100%',
    height: 170,
    resizeMode: 'cover',
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#222',
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  section: {
    padding: 16,
    borderRadius: 14,
    marginBottom: 18,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    backgroundColor: '#fff', // секции остаются белыми для контраста
    elevation: 2,
  },
  sectionRed: {
    borderLeftColor: '#d32f2f',
    backgroundColor: '#fff5f5',
  },
  sectionGray: {
    borderLeftColor: '#999',
    backgroundColor: '#f9f9f9',
  },
  sectionGold: {
    borderLeftColor: '#DAA520',
    backgroundColor: '#fffaf0',
  },
  // остальное без изменений...
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 10,
  },
  bulletList: {
    paddingLeft: 8,
  },
  text: {
    fontSize: 16,
    color: '#444',
    marginVertical: 4,
  },
  bold: {
    fontWeight: 'bold',
    color: '#000',
  },
  red: {
    color: '#d32f2f',
    fontWeight: '700',
  },
  yellow: {
    color: '#fbc02d',
    fontWeight: '700',
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  imageWrapper: {
    flex: 1,
    marginHorizontal: 6,
    borderWidth: 3,
    borderColor: '#DAA520',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#DAA520',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  button: {
    backgroundColor: '#DAA520',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    marginHorizontal: 40,
    shadowColor: '#b8860b',
    shadowOpacity: 0.8,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
