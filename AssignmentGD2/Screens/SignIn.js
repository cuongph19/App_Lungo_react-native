//////////SignIn
import React, { useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const SIGNIN_API = "http://192.168.138.248:3000/users";

function SignIn({ navigation }) {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const changeScreen = async () => {
        try {
            const response = await axios.get(SIGNIN_API, {
                params: {
                    name: name,
                    password: password
                }
            });

            if (response.status === 200) {
                const users = response.data;
                const user = users.find(user => user.name === name && user.password === password);
                if (user) {
                    ToastAndroid.show("Đăng nhập thành công", ToastAndroid.SHORT);
                    await AsyncStorage.setItem('nameUser', name);
                    setName("");
                    setPassword("");
                    navigation.navigate('TabBottom');
                } else {
                    ToastAndroid.show("Đăng nhập thất bại", ToastAndroid.SHORT);
                }
            } else {
                ToastAndroid.show("Đăng nhập thất bại", ToastAndroid.SHORT);
            }
        } catch (error) {
            console.error("Error during sign in:", error);
            ToastAndroid.show("Đã xảy ra lỗi", ToastAndroid.SHORT);
        }
    };

    const SignUp = () => {
        navigation.navigate('SignUp');
    };

    return (
        <View style={styles.container}>
            <Image source={require('../danentang_img/logo1.png')} style={styles.logo} />
            <View style={{ alignItems: 'center', marginTop: 30 }}>
    <TextInput
        style={[styles.TextInput, { color: '#DDDDDD' }]} // Thêm style color là màu trắng
        placeholder='Tên...'
        placeholderTextColor='#DDDDDD' // Đặt màu chữ của placeholder là màu trắng
        onChangeText={(value) => setName(value)}
        value={name}
    />
    <TextInput
        style={[styles.TextInput, { color: '#DDDDDD' }]} // Thêm style color là màu trắng
        placeholder='Mật Khẩu...'
        placeholderTextColor='#DDDDDD' // Đặt màu chữ của placeholder là màu trắng
        secureTextEntry={true}
        onChangeText={(value) => setPassword(value)}
        value={password}
    />
</View>
            <View style={{ alignItems: 'center', marginTop: 30 }}>
                <TouchableOpacity onPress={changeScreen}>
                    <View style={styles.button}>
                        <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>Đăng Nhập</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.textContainer}>
            <Text style={[styles.text, { color: '#AAAAAA' }]}>Nếu chưa có tài khoản hãy bấm?</Text>
                <TouchableOpacity onPress={SignUp}>
                    <Text style={[styles.text, { color: '#845333', fontWeight: 'bold' }]}> Đăng Ký</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222222',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
    TextInput: {
        borderRadius: 10,
        borderWidth: 2,
        width: 300,
        height: 40,
        marginTop: 20,
        paddingLeft: 10,
        backgroundColor: '#222222',
        
    },
    button: {
        backgroundColor: '#845333',
        width: 250,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    text: {
        fontSize: 15,
        color: 'white',
    },
});

export default SignIn;