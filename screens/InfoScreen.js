import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Button, TouchableOpacity, ScrollView } from 'react-native';

import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import { getStorage } from '@react-native-firebase/storage';

import { launchImageLibrary } from 'react-native-image-picker';
import auth from "@react-native-firebase/auth"
import DropDownPicker from 'react-native-dropdown-picker';
import { CommonActions } from '@react-navigation/native';
import UserContext from '../lib/UserContext';
import { style } from 'deprecated-react-native-prop-types/DeprecatedViewPropTypes';
//import AppNameHeader from './component/AppNameHeader';



// 내정보
const InfoScreen = ({ navigation }) => {
    
    const USER = useContext(UserContext)
    
    
    const profileStorage = getStorage(firebase).ref("/profile")


    // 프로필 이미지
    const [imageUrl, setImageUrl] = useState(null);



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



    return (
        <View style = {styles.container}>
            <View style={styles.settingsButton}>
                <TouchableOpacity  onPress={() => { navigation.navigate('InfoSetting') }}>
                    <Image
                        source={require('../assets/settings-icon.png')}
                        style={styles.settingsIcon}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.circleContainer}>
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

                <Text style = {{marginVertical: 8, color: "#000000"}}> {USER.nickname} </Text>
            </View>

            <Text style = {styles.titleText}> My level </Text>
            
            <View style = {styles.levelContainer}>
                <Text style = {styles.headerText}> TOPIK {USER.level} </Text>
                <Text style = {styles.middleText}>- {USER.level == 1? "for beginner": "for intermediate-advanced"}</Text>
            </View>

        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        padding: 8
    },

    circleContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    circle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#A4BAA1',
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

    button: {
        borderRadius: 20,
        padding: 10,
        
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

    levelContainer: {
        backgroundColor: "#D9D9D9", 
        height: 100,
        borderRadius: 10,

        flexDirection: "row",
        alignItems: "center",

        paddingHorizontal: 10
    },

    titleText: {
        fontSize: 20,
        color: "#000000",
        marginVertical: 6
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold"
    },
    middleText:{
        fontSize: 20,
    }
});


export default InfoScreen;
