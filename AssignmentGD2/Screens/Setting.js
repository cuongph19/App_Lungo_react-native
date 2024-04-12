import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

function Setting({ navigation }) {
    const [idUSer, setidUser] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    function ClickLogout() {
        navigation.navigate('SignIn');
        setidUser("");
        setName("");
        setPassword("");
    }

    return (
        <View style={styles.container}>
            {/* Tiêu đề và nút quay lại */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        source={require('../danentang_img/setting.png')}
                        style={styles.backIcon}
                    />
                </TouchableOpacity>
                <Text style={[styles.title, { color: '#AAAAAA' }]}>Settings</Text>
            </View>
            {/* Danh sách các mục */}
            <View style={styles.menu}>
                <TouchableOpacity onPress={() => navigation.navigate('Product')}>
                    <Text style={[styles.menuItem, { borderColor: '#845333', color: '#845333' }]}>Product Management</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Category')}>
                    <Text style={[styles.menuItem, { borderColor: '#845333', color: '#845333' }]}>Category Management</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Help')}>
                    <Text style={[styles.menuItem, { borderColor: '#845333', color: '#845333' }]}>Help</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={ClickLogout}>
                    <Text style={[styles.menuItem, { borderColor: '#845333', color: '#845333' }]}>Log Out</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222222',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    backIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    menu: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    menuItem: {
        fontSize: 18,
        marginBottom: 15,
        fontFamily: 'Roboto',
        letterSpacing: 1,
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
    },
});

export default Setting;