import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './Home';
import Profile from './Profile';
import Oders from './Oders';
import Cart from './Cart';
import Favourite from './Favourite';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const CustomTabBarIcon = (focused, imageSource) => {
  return (
    <View style={{ alignItems: 'center' }}>
      <Image
        source={imageSource}
        resizeMode="contain"
        style={{
          width: 25,
          height: 25,
          tintColor: focused ? '#845333' : '#AAAAAA',
        }}
      />
    </View>
  );
};

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home_Stack" component={Home} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile_Stack" component={Profile} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function FavouriteStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Favourite_Stack" component={Favourite} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function OdersStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Oders_Stack" component={Oders} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function CartStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Cart_Stack" component={Cart} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function TabBottom() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: '#222222',
          borderRadius: 15,
          height: 90,
          ...styles.shadow
        }
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) => CustomTabBarIcon(focused, require('../danentang_img/home.png')),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartStack}
        options={{
          tabBarIcon: ({ focused }) => CustomTabBarIcon(focused, require('../danentang_img/giohang.png')),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Favourite"
        component={FavouriteStack}
        options={{
          tabBarIcon: ({ focused }) => CustomTabBarIcon(focused, require('../danentang_img/yeuthich.png')),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Oders"
        component={OdersStack}
        options={{
          tabBarIcon: ({ focused }) => CustomTabBarIcon(focused, require('../danentang_img/lsmuahang.png')),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5
  }
})

export default TabBottom;