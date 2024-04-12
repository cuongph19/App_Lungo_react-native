import { View, Text, FlatList, Button, Alert, TextInput, Modal, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'

const cnud = ({ navigation }) => {
    const [list, setList] = useState([])
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [editModal, setEditmodel] = useState(false)
    const [selectedItemId, setSelectedItemId] = useState(null)

    const apiUrl = "http://192.168.138.248:3000/users";

    useEffect(() => {
        console.log("test")
        getList()
    }, []);

    // lay du lieu
    const getList = () => {
        fetch(apiUrl, {
            method: "GET"
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                setList(data)
            }).catch(err => {
                console.log(err)
            })
    }

    // sua 1 ban ghi
    const editItem = (id) => {
        fetch(`${apiUrl}/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                "name": name,
                "password": password,
            })
        }).then(res => {
            Alert.alert("Sửa thành công")
            getList()
        }).catch(err => {
            console.log(err)
        })
    }

    const renderItem = ({ item }) => {
        return (
            <View style={{ marginBottom: 20, padding: 10, backgroundColor: '#333333', borderRadius: 10 }}>
                <Text style={{ color: '#AAAAAA', marginBottom: 5 }}>
                    <Text style={{ fontWeight: 'bold', color: '#FFFFFF' }}>Name:</Text> {item.name}
                </Text>
                <Text style={{ color: '#AAAAAA', marginBottom: 5 }}>
                    <Text style={{ fontWeight: 'bold', color: '#FFFFFF' }}>Password:</Text> {item.password}
                </Text>
                <Text style={{ color: '#AAAAAA', marginBottom: 5 }}>
                    <Text style={{ fontWeight: 'bold', color: '#FFFFFF' }}>ID:</Text> {item.id}
                </Text>
                <Button title='Edit' onPress={() => {
                    setEditmodel(true)
                    setSelectedItemId(item.id)
                    setName(item.name)
                    setPassword(item.password)
                }} color='#845333' />
            </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        source={require('../danentang_img/profile.png')}
                        style={styles.backIcon}
                    />
                </TouchableOpacity>
                <Text style={styles.title}>Profile</Text>
            </View>
            <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#222222', padding: 20 }}>
                <FlatList
                    data={list} renderItem={renderItem} keyExtractor={item => item.id.toString()}
                />
                <Modal visible={editModal}>
                    <View style={{ backgroundColor: '#222222', padding: 20 }}>
                        <TextInput placeholder='Name' value={name} onChangeText={(text) => setName(text)} style={{ color: '#AAAAAA', marginBottom: 10 }} />
                        <TextInput placeholder='Password' value={password} onChangeText={(text) => setPassword(text)} style={{ color: '#AAAAAA', marginBottom: 10 }} />
                        <Button title='Sửa' onPress={() => {
                            setEditmodel(false)
                            editItem(selectedItemId)
                        }} color='#845333' />
                    </View>
                </Modal>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333333',
        padding: 10,
    },
    backIcon: {
        width: 20,
        height: 20,
        tintColor: '#845333',
        marginRight: 10,
    },
    title: {
        color: '#AAAAAA',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default cnud;