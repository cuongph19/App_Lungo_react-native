import React, { Component, useState, useEffect } from 'react';
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
    ToastAndroid,
    route
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select'



import axios from 'axios';
const API = "http://192.168.138.248:3000/users"
const API_BILL = "http://192.168.138.248:3000/bill"
const API_CART = "http://192.168.138.248:3000/cart"
const LISTPRODUCTS_API = "http://192.168.138.248:3000/products";
function BuyProduct({ navigation, route }) {
    const [initialPrice, setInitalPrice] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(initialPrice);
    const [name, setName] = useState('');
    const [userData, setUserData] = useState(null);
    const [money, setMoney] = useState();
    const { productData } = route?.params;
    const [password, setPassword] = useState('')
    const [idUser, setidUser] = useState('')
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");



    const loadNameFromStorage = async () => {
        try {
            const nameFromStorage = await AsyncStorage.getItem('nameUser');

            setName(nameFromStorage);

            setInitalPrice(productData.price_product)
            setPrice(productData.price_product)
        } catch (error) {
            console.error('Error loading name from AsyncStorage:', error);
        }
    };

    const loadCustomerDataFromServer = async () => {

        try {
            const response = await axios.get(API, {
                params: {
                    name: name
                }
            });

            if (response.status === 200) {
                const customerData = response.data;
                setidUser(customerData[0].id)
                setMoney(customerData[0].money)
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
    const increaseQuantity = () => {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        setPrice(initialPrice * newQuantity);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            setPrice(initialPrice * newQuantity);
        } else {
            ToastAndroid.show("Không thể giảm được số lượng sản phẩm", 2);
        }
    };
    const Buy = async () => {
        if (selectedPaymentMethod === "") {
            ToastAndroid.show("Hãy chọn phương thức thanh toàn", 2)
            return
        }
        else if (selectedPaymentMethod === 0) {
            const nameFromStorage = await AsyncStorage.getItem('nameUser');

            try {
                const response = await axios.post(API_BILL, {
                    name_bill: productData.name_product,
                    total_bill: price,
                    quantity_bill: quantity,
                    name_user: nameFromStorage,
                    img_bill: productData.img_product,


                });
                if (response.status === 201) {
                    ToastAndroid.show("Mua Hàng Thành Công", 2);
                    navigation.navigate("TabBottom");

                }
                else {

                }
            } catch (error) {
                ToastAndroid.show("Lỗi không mua được sản phẩm", 2);
            }

        }
        else {
            try {
                const nameFromStorage = await AsyncStorage.getItem('nameUser');
                if (money < price) {

                    ToastAndroid.show("Số dư không đủ! Hãy nạp thêm tiền để mua sản phẩm", 2);
                    return;
                }

                if (productData.quantity < quantity) {
                    ToastAndroid.show("Số lượng sản phẩm hiện tại không đủ", 2);
                    return;
                }

                const response = await axios.post(API_BILL, {
                    name_bill: productData.name_product,
                    total_bill: price,
                    quantity_bill: quantity,
                    name_user: nameFromStorage,
                    img_bill: productData.img_product,
                    status_bill: "Đã thanh toán"


                });
                if (response.status === 201) {
                    try {
                        // const idFromStorage = await AsyncStorage.getItem("idUser")
                        console.log("id nguoi mua" + idUser)
                        const response_update = await axios.put(`${API}/${idUser}`, {
                            name: nameFromStorage,
                            password: password,
                            money: parseFloat(money) - parseFloat(price),
                        });

                        if (response_update.status === 200) {
                            setMoney(parseFloat(money) - parseFloat(price));
                            try {
                                console.log(productData.id)
                                const response_product = await axios.put(`${LISTPRODUCTS_API}/${productData.id}`, {
                                    _id: productData._id,
                                    name_product: productData.name_product,
                                    img_product: productData.img_product,
                                    price_product: productData.price_product,
                                    describe_product: productData.describe_product,

                                });
                                if (response_product.status === 200) {
                                    console.log("Đã trừ số lượng sản phẩm")
                                }
                                else {
                                    console.log("Lỗi trừ số lượng sản phẩm")
                                }
                                ToastAndroid.show("Mua Hàng Thành Công", 2);
                                navigation.navigate("TabBottom");
                            } catch (error) {
                                console.error('Error quantity product:', error);
                                ToastAndroid.show("Lỗi chưa trừ số lượng sản phẩm", 2);
                            }

                        } else {
                            console.error('Error updating money:', response_update.data);
                        }
                    } catch (error) {
                        console.error('Error money:', error);
                        ToastAndroid.show("Lỗi chưa trừ tiền", 2);
                    }


                }

                else {
                    console.error('Error buying product:', response.data.message);
                    ToastAndroid.show("Đã xảy ra lỗi khi mua hàng1", 2);
                }
            }
            catch (error) {
                console.error('Error buying product:', error);
                ToastAndroid.show("Đã xảy ra lỗi khi mua hàng", 2);
            }
        }




    }
    const AddCart = async () => {

        try {
            const response1 = await axios.get(API_CART, {
                params: {
                    name_user: name,
                    name_product: productData.name_product,
                },
            });

            if (response1.data.length > 0) {
                ToastAndroid.show("Sản phẩm đã tồn tại trong giỏ hàng!", 2);
                return;
            }
            const response = axios.post(API_CART, {
                name_user: name,
                name_product: productData.name_product,
                img_product: productData.img_product,
                price_product: initialPrice,
                quantity: 1,
                id_product: productData.id,
                id_stt: productData._id
            })
            if ((await response).status === 201) {
                ToastAndroid.show("Đã thêm vào giỏ hàng thành công", 2)
                navigation.navigate("TabBottom");
            }
            else {
                ToastAndroid.show("Thêm vào giỏ hàng thất bại", 2)
            }



        } catch (error) {
            console.log("lỗi" + error.message)

        }
    }
    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 30, fontWeight: "bold", marginBottom: 20 }}>SẢN PHẨM</Text>

            <Image
                source={{ uri: productData.img_product }}
                style={[styles.images]}
            />


            <View style={{ flexDirection: 'row' }}>
                <Text style={styles.name}>{productData.name_product}</Text>

            </View>


            <View style={{ flexDirection: "row" }}>
                <View style={{ flexDirection: "row", marginTop: 18 }}>
                    <TouchableOpacity onPress={decreaseQuantity}>
                        <Image source={require("../Img/icon_minus-removebg-preview.png")} style={styles.quantity} />
                    </TouchableOpacity>
                    <View style={{ width: 100, height: 30, borderWidth: 2, justifyContent: "center", alignItems: "center", marginBottom: 5 }}>
                        <Text style={{ fontSize: 20, fontWeight: "bold",color:'#AAAAAA' }}>{quantity}</Text>
                    </View>
                    <TouchableOpacity onPress={increaseQuantity}>
                        <Image source={require("../Img/icon_plus-removebg-preview.png")} style={styles.quantity} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.price}>Giá:{price}$</Text>
            </View >
            <View style={styles.profile}>
                <Text style={styles.textprofile}>Người Mua: {name}</Text>

            </View >
            <View style={styles.select} >
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 15 ,color:'#AAAAAA'}}>Thanh Toán</Text>
                <View style={{ marginStart: 110, marginTop: -38 }}>
                    <RNPickerSelect
                        onValueChange={(value) => setSelectedPaymentMethod(value)}
                        items={[
                            { label: 'Tiền mặt', value: 0 },
                            { label: 'Ví điện tử', value: 1 },
                        ]}
                    />
                </View>

            </View>
            <View style={{ flexDirection: "column" }}>
                <View style={{ alignItems: 'center', marginTop: 10 }}>
                    <TouchableOpacity onPress={() => Buy()} >
                        <View style={{ backgroundColor: '#845333', width: 300, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center', }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Mua</Text>
                        </View>

                    </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'center', marginTop: 10 }}>
                    <TouchableOpacity onPress={() => AddCart()} >
                        <View style={{ backgroundColor: '#845333', width: 300, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center', }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Thêm Vào Giỏ Hàng</Text>
                        </View>

                    </TouchableOpacity>
                </View>

            </View>

        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        marginTop: 20,
        backgroundColor: '#222222'
    },
    image: {
        width: 300,
        height: 300,
        borderRadius: 10
    },
    images: {
        width: Dimensions.get("window").width - 20,
        height: Dimensions.get("window").width - 40,
        margin: 10,
        borderRadius: 10,
        backgroundColor: "white"
    },
    name: {
        fontSize: 40,
        fontWeight: "bold",
        color:'#845333',
        marginTop: 10,
        marginStart: 10
    },
    price: {
        fontSize: 30,
        fontWeight: "bold",
        color:'#AAAAAA',
        marginTop: 10,
        marginStart: 10
    },
    color: {
        fontSize: 30,
        fontWeight: "bold",
        color: "blue",
        marginTop: 10
    },
    type: {
        fontSize: 30,
        fontWeight: "bold",

        marginTop: 10
    },
    quantity: {
        width: 20,
        height: 20,
        marginRight: 10,
        marginLeft: 10,
        marginTop: 5
    },
    profile: {
        width: 350,
        height: 40,
        borderWidth: 3,
        borderRadius: 5,
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 10,
        paddingLeft: 10
    },
    textprofile: {
        fontSize: 15,
        fontWeight: "bold",
        color:'#AAAAAA'
    },
    select: {
        width: 350,
        height: 65,
        borderWidth: 3,
        borderRadius: 5,
        marginBottom: 10,
        paddingLeft: 10,
    },
})


export default BuyProduct;
