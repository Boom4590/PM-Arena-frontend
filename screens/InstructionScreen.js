import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function InstructionScreen() {
  const navigation = useNavigation();
  const [lang, setLang] = useState('ru');

  const toggleLang = () => setLang(lang === 'ru' ? 'kg' : 'ru');

  const rulesText = {
    ru: {
      title: '📌 Правила участия в турнире',
      extraRulesTitle: '🔰 Как участвовать в турнирах (обязательно прочтите)',
      extraRules: [
        '• Указывайте настоящий PUBG MOBILE ID, с которым будете заходить в лобби. Если зайдете с другим аккаунтом — вас исключат.',
        '• Указывайте номер с WhatsApp — менеджер свяжется по нему.',
        '• Чтобы участвовать: пополните баланс → выберите турнир → нажмите "Участвовать".',
        '• После регистрации данные турнира появятся в "Текущий турнир".',
        '• Займите **только свой слот** — иначе модератор исключит вас.',
        '• В лобби заходите с тем PUBG ID, с которым регистрировались.',
        '• Модератор следит за нарушениями — подозрение в читах/тиминге = проверка до 7 дней.',
        '• Победителям пишут в WhatsApp, они отправляют реквизиты для выплаты.',
        '• При уважительной причине неучастия — можно получить возврат через менеджера.',
        '• Все вопросы — только через WhatsApp менеджера.',
      ],
      rewardsTitle: '🏆 Награды и правила получения:',
      rewards: [
        '• Деньги отправляются победителям в течение 6–12 часов после проверки.',
        '• Победителю пишут в WhatsApp по номеру регистрации.',
        '• При недоступности номера — игрок должен сам написать менеджеру.',
        '• Если игрок попал в лобби без оплаты — награда не выдаётся и бан навсегда.',
      ],
      bansTitle: '1. За следующие нарушения — пожизненный бан:',
      bans: [
        '• Игра с эмулятора',
        '• Использование читов или стороннего ПО',
        '• Использование багов (застревание в текстурах и др.)',
        '• Тиминг (командная игра в SOLO-турнире)',
        '• Занятие чужого слота в лобби',
        '• Передача ID и пароля лобби другим',
      ],
      section2Title: '2. Если вы заняли не свой слот:',
      section2: [
        '• Вы будете исключены, но можете вернуться на своё место до начала матча',
      ],
      section3Title: '3. После входа в лобби:',
      section3: [
        '• Нельзя выходить или менять место',
        '• Если матч начнётся без вас — билет не возвращается',
      ],
      section4Title: '4. Если не удалось зайти в лобби:',
      section4: [
        '• Обратитесь в поддержку WhatsApp и объясните ситуацию',
        '• При подтверждении причины — билет вернётся',
      ],
      understood: 'Понятно',
    },
    kg: {
      title: '📌 Турнирге катышуу эрежелери',
      extraRulesTitle: '🔰 Турнирге катышуу тартиби (милдеттүү түрдө окуңуз)',
      extraRules: [
        '• PUBG MOBILE IDңизди туура жазыңыз — ошол аккаунт менен лоббиге киришиңиз керек.',
        '• WhatsApp номериңизди жазыңыз — менеджер сиз менен байланышат.',
        '• Катышуу үчүн: баланс толтуруңуз → турнир тандаңыз → "Катышуу" баскычын басыңыз.',
        '• Каттоодон кийин "Азыркы турнир" бөлүмүндө маалымат чыгат.',
        '• Ар ким өзүнүн ордуна отурушу керек — болбосо модератор чыгарып салат.',
        '• Лоббиге каттоодо колдонгон PUBG ID менен гана кириңиз.',
        '• Эрежени бузуу (чит, тиминг ж.б.) болсо — текшерүү 7 күнгө чейин узартылышы мүмкүн.',
        '• Жеңгендерге WhatsApp аркылуу жазышат жана реквизиттер суралат.',
        '• Эгер себеп менен катыша албай калсаңыз — менеджер аркылуу билеттин акчасы кайтарылышы мүмкүн.',
        '• Бардык суроолор WhatsApp аркылуу гана чечилет.',
      ],
      rewardsTitle: '🏆 Сыйлык жана шарттар:',
      rewards: [
        '• Сыйлык 6–12 саат ичинде берилет (текшерүүдөн кийин).',
        '• Жеңүүчүгө WhatsApp аркылуу байланышат.',
        '• Номер жеткиликсиз болсо — өзү менеджерге жазуусу керек.',
        '• Башка бирөөнүн ID менен кирип жеңсеңиз — сыйлык берилбейт, өмүр бою бан.',
      ],
      bansTitle: '1. Бул эреже бузулса — өмүр бою бан:',
      bans: [
        '• Эмулятор менен ойноо',
        '• Чит же башка программаларды колдонуу',
        '• Багдарды пайдалануу (дубалга кирүү ж.б.)',
        '• Тиминг (SOLO турнирде командалык оюн)',
        '• Башканын ордуна отуруу',
        '• Лоббинин ID жана сыр сөзүн бөлүшүү',
      ],
      section2Title: '2. Башка орунга отуруп алсаңыз:',
      section2: [
        '• Сиз чыгарылат, бирок оюн башталганга чейин кайта аласыз',
      ],
      section3Title: '3. Лоббиге киргенден кийин:',
      section3: [
        '• Ордуңузду өзгөртүүгө жана чыгууга болбойт',
        '• Эгер оюндун башында жок болсоңуз — билет күйөт',
      ],
      section4Title: '4. Лоббиге кире албасаңыз:',
      section4: [
        '• WhatsApp менен байланышып, себебин түшүндүрүңүз',
        '• Себеп тастыкталса — билет кайтарылат',
      ],
      understood: 'Түшүнүктүү',
    },
  };

  const t = rulesText[lang];

  const renderList = (arr, style) => arr.map((item, idx) => (
    <Text key={idx} style={[styles.text, style]}>{item}</Text>
  ));

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Lang Toggle */}
    

 


       <Text style={styles.title}>{t.title}</Text>
        <View style={styles.fixedTopBar}>
  <TouchableOpacity style={styles.toggleButton} onPress={toggleLang}>
    <View style={styles.langToggleContent}>
      <Text style={styles.flagText}>{lang === 'ru' ? '🇰🇬' : '🇷🇺'}</Text>
      <Text style={styles.langText}>{lang === 'ru' ? 'Кыргызча' : 'Русский'}</Text>
    </View>
  </TouchableOpacity>
</View>
    
      {/* Extra Instructions */}
      <View style={[styles.section, styles.sectionGold]}>
        <Text style={styles.sectionTitle}>{t.extraRulesTitle}</Text>
        {renderList(t.extraRules)}
      </View>

      {/* Rewards */}
      <View style={[styles.section, styles.sectionGold]}>
        <Text style={styles.sectionTitle}>{t.rewardsTitle}</Text>
        {renderList(t.rewards)}
      </View>

      {/* Bans */}
      <View style={[styles.section, styles.sectionRed]}>
        <Text style={styles.sectionTitle}>{t.bansTitle}</Text>
        {renderList(t.bans, styles.red)}
      </View>

      {/* Sections */}
      <View style={[styles.section, styles.sectionGray]}>
        <Text style={styles.sectionTitle}>{t.section2Title}</Text>
        {renderList(t.section2)}
      </View>
      <View style={[styles.section, styles.sectionGray]}>
        <Text style={styles.sectionTitle}>{t.section3Title}</Text>
        {renderList(t.section3)}
      </View>
      <View style={[styles.section, styles.sectionGray]}>
        <Text style={styles.sectionTitle}>{t.section4Title}</Text>
        {renderList(t.section4)}
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
        <Text style={styles.buttonText}>{t.understood}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    flex: 1,
  },
 fixedTopBar: {
  marginTop:10,
  marginBottom:4,
  marginLeft:'auto',
  width:'50%'

},

toggleButton: {
  backgroundColor: '#fff',
  borderRadius: 7,
  paddingVertical: 8,
  paddingHorizontal: 12,
  shadowColor: '#000',
  shadowOpacity: 0.2,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 3 },
  elevation: 10,
  flexDirection: 'row',
  alignItems: 'center',
},

langToggleContent: {
  flexDirection: 'row',
  alignItems: 'center',
},

flagText: {
  fontSize: 18,
  marginRight: 6,
},

langText: {
  fontSize: 16,
  fontWeight: '600',
  color: '#333',
}

,

  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#222',
    marginBottom: 10,
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
    backgroundColor: '#fff',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 10,
  },
  text: {
    fontSize: 17,
    color: '#333',
    marginVertical: 4,
  },
  red: {
    color: '#d32f2f',
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
