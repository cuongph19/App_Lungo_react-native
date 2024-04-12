import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Button, ToastAndroid, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const API_CONTACT = "http://192.168.138.248:3000/contact";

const Help = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [senderName, setSenderName] = useState('');
    const [messageContent, setMessageContent] = useState('');

    const handleContactPress = () => {
        setIsModalVisible(true);
    };

    const handleSendMessage = async () => {
        try {
            if (senderName === '' || messageContent === '') {
                ToastAndroid.show("Vui lòng điền đầy đủ thông tin", ToastAndroid.SHORT);
                return;
            } else {
                const response = await axios.post(API_CONTACT, {
                    name_customer: senderName,
                    content: messageContent
                });
                if (response.status === 201) {
                    ToastAndroid.show("Đã gửi phản hồi thành công", ToastAndroid.SHORT);
                    setSenderName('');
                    setMessageContent('');
                } else {
                    ToastAndroid.show("Gửi phản hồi thất bại", ToastAndroid.SHORT);
                    setSenderName('');
                    setMessageContent('');
                }
            }
        } catch (error) {
            console.error(error);
        }
        setIsModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={handleContactPress}>
                <Text style={styles.buttonText}>Gửi Phản Hồi</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>LIÊN HỆ</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Tên người gửi"
                            placeholderTextColor="#AAAAAA"
                            value={senderName}
                            onChangeText={setSenderName}
                        />
                        <TextInput
                            style={[styles.modalInput, styles.messageInput]}
                            placeholder="Nội dung gửi"
                            placeholderTextColor="#AAAAAA"
                            value={messageContent}
                            onChangeText={setMessageContent}
                            multiline={true}
                            numberOfLines={4}
                        />
                        <Text style={styles.hintText}>Vui lòng nhập đúng thông tin</Text>
                        <View style={styles.modalButtonContainer}>
                            <Button title="Gửi" onPress={handleSendMessage} color="#845333" />
                            <Button title="Đóng" onPress={() => setIsModalVisible(false)} color="#FF5722" />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#222222',
    },
    button: {
        backgroundColor: '#845333',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        width: width * 0.8,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#111111',
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 5,
        height: 40,
        marginBottom: 10,
        paddingHorizontal: 10,
        fontSize: 16,
        color: '#111111',
    },
    messageInput: {
        height: 120,
    },
    hintText: {
        color: '#FF0000',
        marginBottom: 10,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default Help;