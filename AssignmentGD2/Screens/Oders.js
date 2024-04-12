import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ToastAndroid } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BILL = "http://192.168.138.248:3000/bill"

function Orders() {
    const [data, setData] = useState([]);
    const [show, setShow] = useState(true)

    useEffect(() => {
        const interval = setInterval(() => {
            fetchData();

        }, 1000);

        return () => clearInterval(interval);
    }, []);
    const fetchData = async () => {
        try {

            const nameFromStorage = await AsyncStorage.getItem('nameUser');

            const response = await axios.get(API_BILL, {
                params: {
                    name_user: nameFromStorage,
                }
            });
            if (response.status === 200) {
                if (response.data.length === 0) {
                    setShow(true);

                } else {
                    setShow(false);
                    setData(response.data);
                }
            } else {
                setShow(true);

            }

        } catch (error) {
            console.log("Error:", error);
            console.log("Response:", error.response.data);
        }
    };

    return (
        <View style={styles.container}>
            <View style={{ alignItems: "center" }}>
                <Text style={{ marginTop: 10, fontSize: 25, fontWeight: "bold", color: "#AAAAAA", marginStart: 5 }}>Lịch Sử Mua Hàng</Text>
            </View>
            {show ? (
                <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 30, marginTop: 30, color: "#AAAAAA" }}>Hiện Không Có Đơn Hàng Nào Được Mua</Text>
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={(item, index) => (item && item.id ? item.id.toString() : index.toString())}
                    style={{ width: "100%", height: 740 }}
                    renderItem={({ item: dataOrder }) => {
                        return (
                            <View style={styles.itemContainer}>
                                <Image source={{ uri: dataOrder.img_bill }} style={styles.image} />
                                <View style={{ marginStart: 20 }}>
                                    <Text style={styles.name}>{dataOrder.name_bill}</Text>
                                    <Text style={styles.price}>Giá: {dataOrder.total_bill}$</Text>
                                    <Text style={styles.price}>Số Lượng: {dataOrder.quantity_bill}</Text>
                                    <Text style={{
                                        fontSize: 15,
                                        fontWeight: "bold",
                                        color: "#845333",
                                        width: 250
                                    }}>Người Mua: {dataOrder.name_user}</Text>

                                </View>
                            </View>
                        );
                    }}
                />)}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#222222",
        padding: 20,
    },
    itemContainer: {
        backgroundColor: "white",
        borderWidth: 2,
        flexDirection: "row",
        padding: 10,
        marginVertical: 10,
        borderRadius: 10,
        alignItems: "center"
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10
    },
    name: {
        fontSize: 20,
        fontWeight: "bold",
        width: 230,
        color: "#845333"
    },
    price: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#AAAAAA",
        width: 230
    }
});

export default Orders;