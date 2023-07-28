import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Modal, Button, TouchableOpacity } from 'react-native';

import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import { getStorage } from '@react-native-firebase/storage';

import { launchImageLibrary } from 'react-native-image-picker';
import auth from "@react-native-firebase/auth"
import DropDownPicker from 'react-native-dropdown-picker';
import { CommonActions } from '@react-navigation/native';
import UserContext from '../lib/UserContext';
//import AppNameHeader from './component/AppNameHeader';



// 내정보
const InfoScreen = ({ navigation }) => {
    
    const USER = useContext(UserContext)
    
    
    const profileStorage = getStorage(firebase).ref("/profile")


    // 이미지
    const [imageUrl, setImageUrl] = useState(null);


    // 모달창
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'TOPIK 1', value: '1' },
        { label: 'TOPIK 2', value: '2' },
    ]);




    useEffect(() => {

        if (USER) {
            loadImage()
        }

    }, []);




    
    // 프로필 사진 로드
    const loadImage = async () => {
        try {
            const fileName = `${USER.email}.jpg`;
            const storageRef = profileStorage.child(fileName);
            const url = await storageRef.getDownloadURL();

            setImageUrl(url);
        } catch (error) {
            setImageUrl('URL_OF_DEFAULT_IMAGE');
        }
    };


    // 프로필 사진 변경
    const onSelectImage = async () => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                maxWidth: 512,
                maxHeight: 512,
                includeBase64: false,
            },
            async (res) => {
                if (res.assets && res.assets.length > 0) {
                    const fileName = `${USER.email}.jpg`;
                    const storageRef = profileStorage.child(fileName)

                    const response = await fetch(res.assets[0].uri);
                    const blob = await response.blob();
                    await storageRef.put(blob);

                    console.log('Image uploaded successfully:', fileName);

                    loadImage()
                } else {
                    console.log('No image selected.');
                }
            },
        );
    };



    // 레벨 변경
    const updateUserLevel = async (email, newLevel) => {
        try {
            const userDoc = firestore().collection('users').doc(USER.uid)

            if (userDoc) {
                await userDoc.update({ my_level: newLevel });


                USER.level = newLevel
                console.log('my_level 업데이트 완료');
            } else {
                console.log('사용자를 찾을 수 없음');
            }
        } catch (error) {
            console.error('my_level 업데이트 에러:', error);
        }
    };


    // 레벨 선택
    const saveLevelToFirebase = (selectedLevel) => {
        // Firebase에 선택한 레벨 저장하는 로직 구현
        console.log('선택한 레벨:', selectedLevel);
        updateUserLevel(USER.email, selectedLevel);
    };


    return (
        <View>
            <TouchableOpacity
                style={styles.settingsButton}
                onPress={() => { navigation.navigate('InfoSetting') }}
            >
                <View>
                    <Image
                        source={require('../assets/settings-icon.png')}
                        style={styles.settingsIcon}
                    />
                </View>
            </TouchableOpacity>

            <View style={styles.circleContainer}>
                <Text>내 정보</Text>
                <Pressable
                    style={[
                        styles.circle,
                        !imageUrl && styles.circleDefaultImage,
                        { overflow: 'hidden' },
                    ]}
                    onPress={onSelectImage}
                >
                    {imageUrl ? (
                        <Image source={{ uri: imageUrl }} style={styles.circleImage} />
                    ) : (
                        <View style={styles.circleDefaultImageTextContainer}>
                            <Text style={styles.circleDefaultImageText}>+</Text>
                        </View>
                    )}
                </Pressable>

                <Text> 이메일 : {USER.email} </Text>
            </View>

            <Text> 나의 레벨 </Text>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setIsModalVisible(!isModalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>레벨 수정하기</Text>
                        <DropDownPicker
                            open={open}
                            value={value}
                            items={items}
                            setOpen={setOpen}
                            setValue={setValue}
                            setItems={setItems}
                            placeholder="레벨을 선택해 주세요"
                            listMode="FLATLIST"
                            modalProps={{
                                animationType: 'fade',
                            }}
                            modalTitle="레벨 선택"
                        />
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => {
                                setIsModalVisible(!isModalVisible);
                                saveLevelToFirebase(value);
                                navigation.dispatch(
                                    CommonActions.reset({
                                        index: 0,
                                        routes: [{ name: 'Home' }] // 로그인 페이지 이름으로 변경
                                    })
                                );
                            }}
                        >
                            <Text style={styles.textStyle}>저장</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={() => setIsModalVisible(true)}>
                <Text style={styles.textStyle}>수정하기</Text>
            </Pressable>
            <Text> {USER.level}</Text>
        </View>


    );
};
const styles = StyleSheet.create({
    circleContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    circle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#87CEEB',
    },
    circleDefaultImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#556B2F',
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleImage: {
        width: '100%',
        height: '100%',
    },
    circleDefaultImageText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white',
    },
    circleDefaultImageTextContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        height: 200,
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        position: 'absolute',
        right: 10,
        top: 200,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 10,
    },
    buttonOpen: {
        backgroundColor: '#6B8E23',
        width: 60,
        height: 35,
        justifyContent: 'center',
    },
    buttonClose: {
        backgroundColor: '#9ACD32',
        width: 100,
        position: 'absolute',
        top: 150,
        left: 130,
    },
    settingsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginRight: 10,
    },
    settingsIcon: {
        width: 20,
        height: 20,
        top: 10,
    },
});


export default InfoScreen;
