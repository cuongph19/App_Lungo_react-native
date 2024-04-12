import React from 'react';
import {
    View, Text, SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Image,
    Dimensions,
} from 'react-native';

function ProductDetails({ navigation, route }) {
    const { productData } = route?.params;

    return (
        <ScrollView style={{ backgroundColor: '#222222' }}>
            <View style={styles.container}>

                <Text style={{ fontSize: 30, fontWeight: "bold", marginBottom: 20, color: "#845333" }}>Chi tiết Sản Phẩm </Text>

                <Image
                    style={styles.image}
                    source={{ uri: productData.img_product }}
                />
                <Text style={styles.name}>{productData.name_product}</Text>
                <Text style={styles.price}>{productData.price_product}$</Text> 
                <Text style={styles.price}>Tag: {productData.tag_product}</Text>
                <Text style={styles.describe}>{productData.describe_product}</Text>

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        marginTop: 20,
        backgroundColor: '#222222',
        padding: 20,
    },
    image: {
        width: Dimensions.get("window").width - 40,
        height: Dimensions.get("window").width - 40,
        marginVertical: 20,
        borderRadius: 10,
        backgroundColor: "white"
    },
    name: {
        fontSize: 40,
        fontWeight: "bold",
        color: "#845333",
        marginTop: 10
    },
    price: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#845333",
        marginTop: 10
    },
    quantity: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#845333",
        marginTop: 10
    },
    describe: {
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 20,
        color: "#AAAAAA"

    }
})

export default ProductDetails;