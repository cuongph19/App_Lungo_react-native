import React, { useEffect } from 'react';
import { View, Image, Animated, Easing, StyleSheet, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const Welcome = ({ navigation }) => {
  const spinValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(
        spinValue,
        {
          toValue: 1,
          duration: 1500, // Tăng tốc độ quay lên gấp đôi (từ 4000ms lên 2000ms)
          easing: Easing.linear,
          useNativeDriver: true
        }
      )
    ).start();

    setTimeout(() => {
      navigation.navigate('SignIn');
    }, 5000); // Đổi thời gian chuyển sang màn hình khác thành 5 giây
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={styles.container}>
      <Image source={require('../danentang_img/logo_wc.png')} style={styles.logo} />
      <Animated.Image
        source={require('../danentang_img/load.png')}
        style={[styles.animator, { transform: [{ rotate: spin }, { scale: 1 / 3 }] }]} // Thu nhỏ hình xuống một phần ba
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_HEIGHT * 0.3,
    resizeMode: 'contain',
  },
  animator: {
    width: SCREEN_WIDTH * 0.5,
    height: SCREEN_WIDTH * 0.5,
    resizeMode: 'contain',
  },
});

export default Welcome;