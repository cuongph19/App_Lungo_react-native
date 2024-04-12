import React, { useState, useEffect } from 'react';
import {
    View, Text, SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    FlatList,
    Dimensions,
    TextInput,
    Image,
    TouchableOpacity,
    useWindowDimensions,
    ToastAndroid
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from 'react-native-check-box';

const API_USER = "http://192.168.138.248:3000/users"
const API_CART = "http://192.168.138.248:3000/cart";
const API_BILL = "http://192.168.138.248:3000/bill"
const LISTPRODUCTS_API = "http://192.168.138.248:3000/products";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [show, setShow] = useState(true)
    const [password, setPassword] = useState('')
    const [idUser, setidUser] = useState('')
    const [name, setName] = useState('')


    useEffect(() => {
        const interval = setInterval(() => {
            getCartItems();
        }, 1000)
        return () => clearInterval(interval);
    }, []);
    const loadNameFromStorage = async () => {
        try {
            const nameFromStorage = await AsyncStorage.getItem('nameUser');
            setName(nameFromStorage);

        } catch (error) {
            console.error('Error loading name from AsyncStorage:', error);
        }
    };
    const loadCustomerDataFromServer = async () => {

        try {
            const response = await axios.get(API_USER, {
                params: {
                    name: name
                }
            });

            if (response.status === 200) {
                const customerData = response.data;
                setidUser(customerData[0].id)
                setPassword(customerData[0].password)
                console.log("1+" + customerData[0].money);
            } else {
                console.error('Error fetching customer data:', response.data.message);
            }
        } catch (error) {
            console.error('Error loading user data from server:', error);
        }
    };

    useEffect(() => {
        loadNameFromStorage();
    }, []);
    useEffect(() => {
        loadCustomerDataFromServer();
    }, [name]);
    const getCartItems = async () => {
        try {
            const nameFromStorage = await AsyncStorage.getItem('nameUser');
            console.log("ten cart" + nameFromStorage)
            const response = await axios.get(API_CART, {
                params: {
                    name_user: nameFromStorage
                }
            });
            if (response.status === 200) {
                if (response.data.length === 0) {
                    setShow(true)
                }
                else {
                    setShow(false)
                    setCartItems(response.data);
                    console.log(response.data)
                }
            }
            else {
                setShow(true)
            }

        } catch (error) {
            console.log(error);
        }
    };

    const handleCheckboxChange = (itemId) => {
        const updatedSelectedItems = selectedItems.includes(itemId) ?
            selectedItems.filter(id => id !== itemId) :
            [...selectedItems, itemId];
        setSelectedItems(updatedSelectedItems);
        calculateTotalAmount(updatedSelectedItems);

    };

    const calculateTotalAmount = (selectedItems) => {
        let total = 0;
        cartItems.forEach(item => {
            if (selectedItems.includes(item.id)) {
                const price = Number(item.price_product);
                total += price * (item.quantity);
            }
        });
        setTotalAmount(total);
    };

    const handQuantityChange = async (itemId, quantity) => {
        if (quantity < 1) {
            ToastAndroid.show("Số lượng không được nhỏ hơn 1", 2);
            return;
        }

        try {
            const nameFromStorage = await AsyncStorage.getItem("nameUser");
            const itemToUpdate = cartItems.find((item) => item.id === itemId);
            if (!itemToUpdate) {
                console.log("sản phẩm không tồn tại!");
                return;
            }

            const response = await axios.put(`${API_CART}/${itemId}`, {
                name_user: nameFromStorage,
                ...itemToUpdate,
                quantity: quantity,
            });

            if (response.status === 200) {
                const updateCartItems = cartItems.map((item) =>
                    item.id === itemId ? { ...item, quantity } : item
                );
                setCartItems(updateCartItems);
                totalAmount(selectedItems);
            } else {
                ToastAndroid.show("Lỗi không cập nhật số lượng sản phẩm", 2);
            }
        } catch (error) {
            console.log(error);
        }
    };


    const handleRemoveItem = async (itemId) => {
        try {
            const response = await axios.delete(`${API_CART}/${itemId}`);
            if (response.status === 200) {
                ToastAndroid.show("Đã xóa sản phẩm khỏi giỏ hàng", 2)
                const updatedCartItems = cartItems.filter(item => item.id !== itemId);
                setCartItems(updatedCartItems);
                const updatedSelectedItems = selectedItems.filter(id => id !== itemId);
                setSelectedItems(updatedSelectedItems);
                calculateTotalAmount(updatedSelectedItems);
            }
            else {
                ToastAndroid.show("Lỗi không xóa sản phẩm khỏi giỏ hàng", 2)
            }
        } catch (error) {

        }


    };

    const handleBuySelectedItems = async () => {
        try {
            const name = await AsyncStorage.getItem("nameUser");
            selectedItems.forEach(async (itemId) => {
                const selectedItem = cartItems.find((item) => item.id === itemId);
                if (selectedItem) {

                    if (selectedItem.quantity_product < selectedItem.quantity) {
                        ToastAndroid.show("Số lượng sản phẩm không đủ", 2)
                        return
                    }
                    else {
                        const response = await axios.post(API_BILL, {
                            name_bill: selectedItem.name_product,
                            total_bill: selectedItem.price_product * selectedItem.quantity,
                            quantity_bill: selectedItem.quantity,
                            name_user: name,
                            img_bill: selectedItem.img_product,
                        });
                        if (response.status === 201) {
                            ToastAndroid.show("Đã mua hàng thành công", 2);
                            setSelectedItems([]);
                            setTotalAmount(0)
                        } else {
                            ToastAndroid.show("Lỗi khi mua hàng 1", 2);
                        }
                    }

                }
            });

        } catch (error) {
            console.log("Error while buying selected items:", error);
            ToastAndroid.show("Lỗi khi mua hàng", 2);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={{ alignItems: "center" }}>
                <Text style={{ marginTop: 10, fontSize: 25, fontWeight: "bold", color: "#AAAAAA", marginBottom: 10 }}>Giỏ Hàng</Text>
            </View>
            {show ? (<Text style={{ fontSize: 20, fontWeight: "bold", height: "80%", marginTop: 20, color: "#AAAAAA" }}>Hiện Không Có Sản Phẩm Nào Trong Giỏ Hàng</Text>) :
                (<FlatList
                    data={cartItems}
                    renderItem={({ item }) => (
                        <View style={styles.cartItem}>
                            <Image
                                source={{ uri: item.img_product }}
                                style={styles.image}
                            />
                            <View style={styles.itemDetails}>
                                <Text style={styles.itemName}>{item.name_product}</Text>
                                <Text style={styles.itemPrice}>${item.price_product}</Text>
                            </View>
                            <View style={styles.quantityContainer}>
                                <TouchableOpacity
                                    onPress={() => handQuantityChange(item.id, item.quantity - 1)}
                                >
                                    <Text style={styles.quantityButton}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.quantity}>{item.quantity}</Text>
                                <TouchableOpacity
                                    onPress={() => handQuantityChange(item.id, item.quantity + 1)}
                                >
                                    <Text style={styles.quantityButton}>+</Text>
                                </TouchableOpacity>
                            </View>
                            <CheckBox
                                style={styles.checkbox}
                                onClick={() => handleCheckboxChange(item.id)}
                                isChecked={selectedItems.includes(item.id)}
                            />
                            <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
                                <Image source={require("../Img/delete-removebg-preview.png")} style={{ width: 25, height: 25, margin: 10 }} />
                            </TouchableOpacity>
                        </View>
                    )}
                />)}
            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Tổng Giá:</Text>
                <Text style={styles.totalAmountText}>${totalAmount}</Text>
                <TouchableOpacity onPress={() => handleBuySelectedItems()}>
                    <View style={{ backgroundColor: '#845333', width: 180, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, color: "#AAAAAA" }}>MUA</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "90%",
        backgroundColor: '#222222',
        padding: 16,
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#EEEEEE',
        margin: 5,
        borderRadius: 8
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 4,
        marginRight: 16,
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        width: 80,
        color: "#845333"

    },
    itemPrice: {
        fontSize: 14,
        color: "#AAAAAA"
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    quantityButton: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        marginHorizontal: 8,


    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
    totalText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: "#AAAAAA"
    },
    totalAmountText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: "#AAAAAA"
    },
});
export default Cart;