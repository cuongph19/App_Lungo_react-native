import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Alert, TextInput, Modal, StyleSheet, TouchableOpacity, Image } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const Product = ({ navigation }) => {
    const [list, setList] = useState([]);
    const [name_product, setName_product] = useState("");
    const [img_product, setImg_product] = useState("");
    const [price_product, setPrice_product] = useState("");
    const [tag_product, setTag_product] = useState("");
    const [describe_product, setDescribe_product] = useState("");
    const [editModal, setEditmodel] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);

    const apiUrl = "http://192.168.138.248:3000/products";

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
                name_product,
                img_product,
                price_product,
                tag_product,
                describe_product,
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
                name_product,
                img_product,
                price_product,
                tag_product,
                describe_product,
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
                <Image source={{ uri: item.img_product }} style={styles.image} />
                <View style={styles.productInfo}>
                    <Text style={styles.productName}>{item.name_product}</Text>
                    <Text style={styles.productPrice}>{item.price_product}$</Text>
                </View>
                <TouchableOpacity onPress={() => { 
                    setEditmodel(true);
                    setSelectedItemId(item.id);
                    setName_product(item.name_product);
                    setImg_product(item.img_product);
                    setTag_product(item.tag_product);
                    setPrice_product(item.price_product);
                    setDescribe_product(item.describe_product);
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
                        source={require('../danentang_img/product.png')}
                        style={styles.backIcon}
                    />
                </TouchableOpacity>
                <Text style={[styles.title, { color: '#AAAAAA' }]}>Product Management</Text>
            </View>
            <View style={styles.inputContainer}>
                <TextInput style={styles.input} placeholder='Tên sản phẩm' onChangeText={text => setName_product(text)} />
                <TextInput style={styles.input} placeholder='URL ảnh' onChangeText={text => setImg_product(text)} />
                <TextInput style={styles.input} placeholder='Giá' onChangeText={text => setPrice_product(text)} />
                <RNPickerSelect
                    style={styles.input}
                    onValueChange={(value) => setTag_product(value)}
                    items={[
                        { label: 'Phone', value: 'phone' },
                        { label: 'Laptop', value: 'laptop' },
                        { label: 'Khác', value: 'khac' },
                    ]}
                    placeholder={{ label: 'Chọn tag', value: null }}
                />
                <TextInput style={styles.input} placeholder='Mô tả' onChangeText={text => setDescribe_product(text)} />
                <Button title='Thêm sản phẩm' onPress={addItem} color='#845333' />
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
                        placeholder='Tên sản phẩm'
                        placeholderTextColor='#AAAAAA'
                        value={name_product}
                        onChangeText={text => setName_product(text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='URL ảnh'
                        placeholderTextColor='#AAAAAA'
                        value={img_product}
                        onChangeText={text => setImg_product(text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Giá'
                        placeholderTextColor='#AAAAAA'
                        value={price_product}
                        onChangeText={text => setPrice_product(text)}
                    />
                    <RNPickerSelect
                        style={styles.input}
                        onValueChange={(value) => setTag_product(value)}
                        items={[
                            { label: 'Phone', value: 'phone' },
                            { label: 'Laptop', value: 'laptop' },
                            { label: 'Khác', value: 'khac' },
                        ]}
                        placeholder={{ label: 'Chọn tag', value: null }}
                        value={tag_product}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Mô tả'
                        placeholderTextColor='#AAAAAA'
                        value={describe_product}
                        onChangeText={text => setDescribe_product(text)}
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

export default Product;