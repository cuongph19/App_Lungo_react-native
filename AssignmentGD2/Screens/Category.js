import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Alert, TextInput, Modal, StyleSheet, TouchableOpacity, Image } from 'react-native';

const Category = ({ navigation }) => {
    const [list, setList] = useState([]);
    const [tag_product, setTag_product] = useState("");
    const [editModal, setEditmodel] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);

    const apiUrl = "http://192.168.138.248:3000/tag";

    useEffect(() => {
        getList();
    }, []);

    const getList = () => {
        fetch(apiUrl)
            .then(res => res.json())
            .then(data => setList(data))
            .catch(err => console.log(err));
    }

    const deleteItem = (id) => {
        fetch(`${apiUrl}/${id}`, {
            method: "DELETE"
        })
            .then(res => {
                Alert.alert("Xóa thành công");
                getList();
            })
            .catch(err => console.log(err));
    }

    const addItem = () => {
        fetch(apiUrl, {
            method: "POST",
            body: JSON.stringify({
                tag_product,
            })
        })
            .then(res => {
                Alert.alert("Thêm thành công");
                getList();
            })
            .catch(err => console.log(err));
    }

    const editItem = (id) => {
        fetch(`${apiUrl}/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                tag_product,
            })
        })
            .then(res => {
                Alert.alert("Sửa thành công");
                getList();
            })
            .catch(err => console.log(err));
    }

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity style={styles.productItem}>
                <View style={styles.productInfo}>
                    <Text style={styles.productPrice}>{item.tag_product}</Text>
                </View>
                <TouchableOpacity onPress={() => { 
                    setEditmodel(true);
                    setSelectedItemId(item.id);
                    setTag_product(item.tag_product);
                }}>
                    <Image source={require('../danentang_img/update.png')} style={styles.actionIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteItem(item.id)}>
                    <Image source={require('../danentang_img/delete.png')} style={styles.actionIcon} />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        source={require('../danentang_img/category.png')}
                        style={styles.backIcon}
                    />
                </TouchableOpacity>
                <Text style={[styles.title, { color: '#AAAAAA' }]}>Category Management</Text>
            </View>
            <View style={styles.inputContainer}>
                <TextInput style={styles.input} placeholder='Tag' onChangeText={text => setTag_product(text)} />
                <Button title='Thêm Tag' onPress={addItem} color='#845333' />
            </View>
            <FlatList
                data={list}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
            />
            <Modal visible={editModal}>
                <View style={styles.modalContainer}>
                
                           <TextInput
                        style={styles.input}
                        placeholder='Tag'
                        placeholderTextColor='#AAAAAA'
                        value={tag_product}
                        onChangeText={text => setTag_product(text)}
                    />
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => { editItem(selectedItemId); setEditmodel(false); }}
                    >
                        <Text style={styles.editButtonText}>Sửa</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222222',
        padding: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backIcon: {
        width: 25,
        height: 25,
        marginRight: 10,
      
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#FFFFFF',
        marginBottom: 10,
        padding: 10,
        borderRadius: 5,
    },
    productItem: {
        flexDirection: 'row',
        backgroundColor: '#845333',
        borderRadius: 10,
        marginBottom: 20,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    productInfo: {
        flex: 1,
        padding: 10,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#AAAAAA'
    },
    productPrice: {
        fontSize: 14,
        color: '#AAAAAA'
    },
    actionIcon: {
        width: 25,
        height: 25,
        marginRight: 5,
        tintColor: '#AAAAAA'
    },
    modalContainer: {
        backgroundColor: '#222222',
        padding: 20,
        borderRadius: 10,
        margin: 20,
    },
    editButton: {
        backgroundColor: '#845333',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    editButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    }
});

export default Category;