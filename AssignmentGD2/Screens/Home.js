import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    FlatList,
    TextInput,
    Image,
    TouchableOpacity,
    ToastAndroid,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LISTPRODUCTS_API = "http://192.168.138.248:3000/products";
const API_FAVORITE = "http://192.168.138.248:3000/favorite";

function Home({ navigation }) {
    const [searchProduct, setSearchProduct] = useState("");
    const [searchTag, setSearchTag] = useState("");
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedTag, setSelectedTag] = useState('');

    const fetchData = async () => {
        try {
            const response = await axios.get(LISTPRODUCTS_API);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data from the server:', error.message);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            fetchData();
        }, 1000)
        return () => clearInterval(interval)
    }, []);

    useEffect(() => {
        const filteredResults = data.filter((product) =>
            product.name_product.toLowerCase().includes(searchProduct.toLowerCase()) &&
            product.tag_product.toLowerCase().includes(searchTag.toLowerCase())
        );
    
        setFilteredData(filteredResults);
    }, [searchProduct, searchTag, data]);


    const DetailsProduct = (productData) => {
        navigation.navigate("ProductDetails", { productData });
    };

    const BuyProduct = async (productData) => {
        navigation.navigate("BuyProduct", { productData });
    };

    const Add_favorite = async (productData) => {
        const response_favorite = await axios.get(API_FAVORITE, {
            params: {
                name_product: productData.name_product
            }
        })
        if (response_favorite.data.length > 0) {
            ToastAndroid.show("Sản phẩm đã có trong danh sách yêu thích", 2)
            return;
        }
        const name = await AsyncStorage.getItem("nameUser");
        try {
            const response = await axios.post(API_FAVORITE, {
                name_user: name,
                name_product: productData.name_product,
                img_product: productData.img_product,
            });
            if (response.status === 201) {
                ToastAndroid.show("Đã thêm sản phẩm vào danh sách yêu thích", 2)
            }
        } catch (error) {
            console.error(error.message);
            ToastAndroid.show("Lỗi thêm sản phẩm vào danh sách yêu thích", 2)
        }
    };

    const goToProfile = () => {
        navigation.navigate("Profile");
    };

    const goToSettings = () => {
        navigation.navigate("Setting");
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
                <TouchableOpacity onPress={goToProfile}>
                    <Image
                        source={require('../danentang_img/profile.png')}
                        style={styles.icon}
                    />
                </TouchableOpacity>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm Sản Phẩm..."
                    value={searchProduct}
                    onChangeText={(text) => setSearchProduct(text)}
                    placeholderTextColor="#AAAAAA"
                />
                <TouchableOpacity onPress={goToSettings}>
                    <Image
                        source={require('../danentang_img/setting.png')}
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.tagButton, selectedTag === 'phone' && styles.selectedTag]} onPress={() => { setSearchTag('phone'); setSelectedTag('phone'); }}>
                    <Text style={styles.tagButtonText}>iphone</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tagButton, selectedTag === 'laptop' && styles.selectedTag]} onPress={() => { setSearchTag('laptop'); setSelectedTag('laptop'); }}>
                    <Text style={styles.tagButtonText}>Laptop</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tagButton, selectedTag === 'khac' && styles.selectedTag]} onPress={() => { setSearchTag('khac'); setSelectedTag('khac'); }}>
                    <Text style={styles.tagButtonText}>Other</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tagButton, selectedTag === '' && styles.selectedTag]} onPress={() => { setSearchTag(''); setSelectedTag(''); }}>
                    <Text style={[styles.tagButtonText, styles.clearButtonText]}>Bỏ Lọc</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                style={{ marginBottom: 100 }}
                contentContainerStyle={styles.flatListContent}
                data={filteredData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item: listproduct }) => (
                    <TouchableOpacity onPress={() => DetailsProduct(listproduct)} style={styles.productItem}>
                        <Image source={{ uri: listproduct.img_product }} style={styles.image} />
                        <View style={styles.productInfo}>
                            <Text style={styles.productName}>Tên: {listproduct.name_product}</Text>
                            <Text style={styles.productPrice}>Giá: {listproduct.price_product}$</Text>
                            <View style={styles.productActions}>
                                <TouchableOpacity onPress={() => BuyProduct(listproduct)}>
                                    <Image
                                        source={require('../danentang_img/giohang.png')}
                                        style={styles.iconBuy}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => Add_favorite(listproduct)}>
                                    <Image
                                        source={require('../danentang_img/yeuthich.png')}
                                        style={styles.iconBuy}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#222222",
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    tagButton: {
        backgroundColor: '#333333',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginHorizontal: 5,
    },
    tagButtonText: {
        color: '#AAAAAA',
        fontSize: 14,
    },
  
    clearButtonText: {
        color: '#AAAAAA',
    },
    searchInput: {
        flex: 1,
        padding: 10,
        backgroundColor: "#333333",
        borderRadius: 10,
        color: '#AAAAAA'
    },
    icon: {
        width: 25,
        height: 25,
        marginRight: 10,
        tintColor: '#AAAAAA'
    },
    flatListContent: {
        paddingVertical: 10,
        paddingHorizontal: 20,
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
    productTag: {
        fontSize: 14,
        color: '#AAAAAA'
    },
    productActions: {
        flexDirection: 'row',
        marginTop: 10,
    },
    iconBuy: {
        width: 25,
        height: 25,
        marginRight: 5,
        tintColor: '#AAAAAA'
    },
    selectedTag: {
        backgroundColor: '#666666',
    },
});

export default Home;