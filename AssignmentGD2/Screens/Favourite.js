import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ProductDetails from './ProductDetails';

const API_FAVORITE = "http://192.168.138.248:3000/favorite";
const API_PRODUCTS = "http://192.168.138.248:3000/products";

const favourite = ({ navigation }) => {
    const [name, setName] = useState('');
    const [dataFa, setDataFa] = useState([]);

    const loadNameFromStorage = async () => {
        const nameFromStorage = await AsyncStorage.getItem('nameUser');
        setName(nameFromStorage);

        try {
            const response_fa = await axios.get(API_FAVORITE, {
                params: {
                    name_user: nameFromStorage
                }
            });
            if (response_fa.status === 200) {
                setDataFa(response_fa.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const interval = setInterval(loadNameFromStorage, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleDeleteFavorite = async (id) => {
        try {
            const response = await axios.delete(`${API_FAVORITE}/${id}`);
            if (response.status === 200) {
                const updatedDataFa = dataFa.filter((item) => item.id !== id);
                setDataFa(updatedDataFa);
                Alert.alert('Xóa khỏi danh sách yêu thích thành công.');
            } else {
                Alert.alert('Xóa khỏi danh sách thất bại.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi xóa.');
        }
    };

    const handleItemPress = async (item) => {
        try {
            const response_product = await axios.get(API_PRODUCTS, {
                params: {
                    name_product: item.name_product
                }
            });
            if (response_product.status === 200) {
                const productData = response_product.data[0];
                navigation.navigate("ProductDetails", { productData });
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi truy vấn dữ liệu sản phẩm.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Danh sách yêu thích</Text>
            <ScrollView>
                {dataFa.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => handleItemPress(item)}>
                        <View style={styles.itemContainer}>
                            <View style={styles.productInfoContainer}>
                                <Image source={{ uri: item.img_product }} style={styles.image} />
                                <View style={styles.itemTextContainer}>
                                    <Text style={styles.itemText}>{item.name_product}</Text>
                                  
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => handleDeleteFavorite(item.id)}>
                                <Image source={require('../Img/delete-removebg-preview.png')} style={styles.icon} />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#222222',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#845333',
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#EEEEEE',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    productInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    itemTextContainer: {
        flexDirection: 'column',
    },
    itemText: {
        color: '#845333',
    },
    icon: {
        width: 24,
        height: 24,
    },
});

export default favourite;