import React, { useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, Animated, ImageBackground } from 'react-native';

const numColumns = 8;
const screenWidth = Dimensions.get('window').width;
const horizontalPadding = 16;
const marginPerItem = 2;
const totalSpacing = marginPerItem * 2 * numColumns + horizontalPadding;
const itemSize = (screenWidth - totalSpacing) / numColumns;

const slotImage = require('../jpg/slotImage.png');

const LobbyGrid = ({ players, currentUserId }) => {
  const data = Array.from({ length: 100 }, (_, i) => {
    const slotId = i + 1;
    const player = players.find(p => p.slot === slotId);
    return {
      slot: slotId,
      nickname: player?.nickname || null,
      userId: player?.id || null,
      index: i,
    };
  });

  // Массив Animated.Value для каждого элемента
  const animations = useRef(data.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animationsSequence = data.map((_, i) =>
      Animated.timing(animations[i], {
        toValue: 1,
        duration: 400,
        delay: i * 25, // задержка 25мс между появлением слотов
        useNativeDriver: true,
      })
    );
    Animated.stagger(30, animationsSequence).start();
  }, [animations, data]);

  const renderItem = ({ item }) => {
    const isCurrentUser = item.slot === currentUserId;

    const animatedStyle = {
      opacity: animations[item.index],
      transform: [
        {
          translateY: animations[item.index].interpolate({
            inputRange: [0, 1],
            outputRange: [10, 0], // сдвигаем снизу вверх
          }),
        },
      ],
    };

    // Выбираем стили слота (если пустой или текущий пользователь)
    const slotStyles = [
      styles.slot,
      !item.nickname && styles.emptySlot,
      isCurrentUser && styles.currentUserSlot,
    ];

    return (
      <Animated.View style={[slotStyles, animatedStyle]}>
        <ImageBackground
          source={slotImage}
          resizeMode="cover"
          style={styles.imageBackground}
          imageStyle={{ borderRadius: 2, opacity:0.1 }}
        >
          <Text style={styles.slotNumber}>{item.slot}</Text>
          {item.nickname ? (
            <Text style={styles.nickname} numberOfLines={2}>
              {item.nickname}
            </Text>
          ) : (
            <Text style={styles.emptyText}></Text>
          )}
        </ImageBackground>
      </Animated.View>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.slot.toString()}
      numColumns={numColumns}
      contentContainerStyle={styles.container}
      scrollEnabled={true}
      horizontal={false}
      showsVerticalScrollIndicator={true}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: '#555',
  },
  slot: {
    width: itemSize,
    height: itemSize,
    marginHorizontal: 2,
    marginVertical: 4,
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: '#333',
    overflow: 'hidden', // важен для borderRadius с ImageBackground
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    backgroundColor: '#e8ecef', // базовый фон если картинка не загрузится
  },
  currentUserSlot: {
    borderColor: 'lime',
    backgroundColor: '#fff9e6',
  },
  emptySlot: {
    backgroundColor: '#f2f2f2',
    borderStyle: 'dashed',
    borderColor: '#999',
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
   
  },
  slotNumber: {
    color: '#555',
    fontSize: 9,
    fontWeight: '600',
    marginBottom: 1,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  nickname: {
    color: '#1E3D23',
    fontWeight: '700',
    fontSize: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(255,255,255,0.8)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  emptyText: {
    color: '#aaa',
    fontSize: 9,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default LobbyGrid;
