//////SignUp

import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Image, TextInput, StyleSheet, ToastAndroid } from 'react-native';
import axios from 'axios';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
const SIGNUP_API = "http://192.168.138.248:3000/users";
const SignUp = ({ navigation }) => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [money, setMoney] = useState(0);
    const [users, setUsers] = useState([]);

    const CheckUsername = async (username) => {
        try {
            const response = await axios.get(SIGNUP_API);
            if (response.status === 200) {
                const users = response.data;
                const userExists = users.find(user => user.name === username);
                return userExists;
            }
        } catch (error) {
            console.error("Error during checking username:", error);
            ToastAndroid.show("Đã xảy ra lỗi", 2);
        }
    };

    const Accept = async () => {
        if (name === '' || password === '') {
            ToastAndroid.show("Vui lòng nhập đầy đủ thông tin", 2);
            return;
        }

        try {
            // Kiểm tra xem tên người dùng đã tồn tại chưa

            const userExists = await CheckUsername(name);

            if (userExists) {
                ToastAndroid.show("Tên người dùng đã tồn tại", 2);
                return;
            }
            else {
                const newUser = { name, password, money };
                setUsers([...users, newUser]);

                const response = await axios.post(SIGNUP_API, {
                    name,
                    password,
                    money
                });
                if (response.status === 201) {
                    ToastAndroid.show("Đăng ký thành công", 2);
                    navigation.navigate("SignIn");
                }
                else {
                    ToastAndroid.show("Đăng ký thất bại", 2);
                }
            }
        }
        catch (error) {
            console.error("Error during sign up:", error);
            ToastAndroid.show("Đã xảy ra lỗi", 2);
        }
    };

    return (

        <View style={styles.container}>
        <Image source={require('../danentang_img/logo1.png')} style={styles.logo} />
        <View style={{ alignItems: 'center', marginTop: 30 }}>
                                <TextInput style={[styles.TextInput, { color: '#DDDDDD' }]}
                                    placeholder='Tên...'
                                    placeholderTextColor='#DDDDDD'
                                    onChangeText={(value) => setName(value)}
                                    value={name}
                                />
                                <TextInput style={[styles.TextInput, { color: '#DDDDDD' }]}
                                    placeholder='Mật Khẩu...'
                                    placeholderTextColor='#DDDDDD'
                                    secureTextEntry={true}
                                    onChangeText={(value) => setPassword(value)}
                                    value={password}
                                />

                            </View>

                            <View style={{ alignItems: 'center' , marginTop: 30 }}>
                                <TouchableOpacity onPress={Accept}>
                                    <View style={styles.SignUpButton}>
                                        <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>Đăng Ký</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                        </View>

    );
}

const styles = StyleSheet.create({
    TextInput: {
        borderRadius: 10,
        borderWidth: 2,
        width: 300,
        height: 40,
        marginTop: 30,
        paddingLeft: 10
    },
    SignUpButton: {
        backgroundColor: '#845333',
        width: 250,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },

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

});


export default SignUp;
