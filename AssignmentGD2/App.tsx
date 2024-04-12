/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type { PropsWithChildren } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';


import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from './Screens/SignIn';
import SignUp from './Screens/SignUp';
import Home from './Screens/Home';
import BuyProduct from './Screens/BuyProduct';
import Oders from './Screens/Oders';
import ProductDetails from './Screens/ProductDetails';
import Profile from './Screens/Profile';
import TabBottom from './Screens/TabBottom';
import Cart from './Screens/Cart';
import Wellcome from './Screens/Welcome';
import Favourite from './Screens/Favourite';
import Setting from './Screens/Setting';
import Product from './Screens/Product';
import Category from './Screens/Category';
import Help from './Screens/Help';
const Stack = createNativeStackNavigator();



function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';


  return (
    <NavigationContainer>

      <Stack.Navigator >
      <Stack.Screen
          name='Wellcome'
          component={Wellcome}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='SignIn'
          component={SignIn}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='SignUp'
          component={SignUp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Home'
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='BuyProduct'
          component={BuyProduct}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Oders'
          component={Oders}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Profile'
          component={Profile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='ProductDetails'
          component={ProductDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Cart'
          component={Cart}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='TabBottom'
          component={TabBottom}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Favourite'
          component={Favourite}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Setting'
          component={Setting}
          options={{ headerShown: false }}
          />
        <Stack.Screen
          name='Category'
          component={Category}
          options={{ headerShown: false }}
          />
        <Stack.Screen
          name='Product'
          component={Product}
          options={{ headerShown: false }}
          />
          <Stack.Screen
          name='Help'
          component={Help}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>


    </NavigationContainer>


  );
}



export default App;
